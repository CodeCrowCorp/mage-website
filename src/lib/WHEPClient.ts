import negotiateConnectionWithClientOffer from '$lib/negotiateConnectionWithClientOffer'
import { getAudioIndicator } from '$lib/utils'

/**
 * Example implementation of a client that uses WHEP to playback video over WebRTC
 *
 * https://www.ietf.org/id/draft-murillo-whep-00.html
 */
export default class WHEPClient extends EventTarget {
	private peerConnection: RTCPeerConnection
	private stream: MediaStream

	constructor(private endpoint: string, private videoElement: any) {
		super()
		this.stream = new MediaStream()

		/**
		 * Create a new WebRTC connection, using public STUN servers with ICE,
		 * allowing the client to disover its own IP address.
		 * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols#ice
		 */
		this.peerConnection = new RTCPeerConnection({
			iceServers: [
				{
					urls: 'stun:stun.cloudflare.com:3478'
				}
			],
			bundlePolicy: 'max-bundle'
		})

		/** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTransceiver */
		this.peerConnection.addTransceiver('video', {
			direction: 'recvonly'
		})

		this.peerConnection.addTransceiver('audio', {
			direction: 'recvonly'
		})

		/**
		 * When new tracks are received in the connection, store local references,
		 * so that they can be added to a MediaStream, and to the <video> element.
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event
		 */
		this.peerConnection.ontrack = (event) => {
			const track = event.track
			const currentTracks = this.stream.getTracks()
			const streamAlreadyHasVideoTrack = currentTracks.some((track) => track.kind === 'video')
			const streamAlreadyHasAudioTrack = currentTracks.some((track) => track.kind === 'audio')
			if (track.kind === 'video') {
				if (streamAlreadyHasVideoTrack) {
					return
				}
				this.stream.addTrack(track)
			} else if (track.kind === 'audio') {
				if (streamAlreadyHasAudioTrack) {
					return
				}
				this.stream.addTrack(track)
				getAudioIndicator(this.stream, this)
			} else {
				console.log('got unknown track ' + track)
			}

			if (track.kind === 'video') {
				if (track.readyState === 'live') {
					this.dispatchEvent(new CustomEvent(`isScreenLive`, { detail: true }))
				} else {
					this.dispatchEvent(new CustomEvent(`isScreenLive`, { detail: false }))
				}
			}
		}

		this.peerConnection.addEventListener('connectionstatechange', () => {
			if (this.peerConnection.connectionState !== 'connected') {
				return
			}
			this.videoElement.srcObject = this.stream
		})

		this.peerConnection.addEventListener('negotiationneeded', () => {
			negotiateConnectionWithClientOffer(this.peerConnection, this.endpoint)
		})
	}
}

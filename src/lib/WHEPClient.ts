import negotiateConnectionWithClientOffer from '$lib/negotiateConnectionWithClientOffer'

/**
 * Example implementation of a client that uses WHEP to playback video over WebRTC
 *
 * https://www.ietf.org/id/draft-murillo-whep-00.html
 */
export default class WHEPClient {
	private peerConnection: RTCPeerConnection
	private stream: MediaStream

	constructor(private endpoint: string, private videoElement: any, private trackType: string) {
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

		const trackOrKind = trackType === 'screen' || trackType === 'webcam' ? 'video' : 'audio'

		/** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTransceiver */
		this.peerConnection.addTransceiver(trackOrKind, {
			direction: 'recvonly'
		})

		//NOTE: used for system audio
		if (this.trackType === 'screen') {
			this.peerConnection.addTransceiver('audio', {
				direction: 'recvonly'
			})
		}

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
			switch (track.kind) {
				case 'video':
					if (streamAlreadyHasVideoTrack) {
						break
					}
					this.stream.addTrack(track)
					break
				case 'audio':
					if (streamAlreadyHasAudioTrack) {
						break
					}
					this.stream.addTrack(track)
					break
				default:
					console.log('got unknown track ' + track)
			}
		}

		this.peerConnection.addEventListener('connectionstatechange', (ev) => {
			if (this.peerConnection.connectionState !== 'connected') {
				return
			}
			this.videoElement.srcObject = this.stream
		})

		this.peerConnection.addEventListener('negotiationneeded', (ev) => {
			negotiateConnectionWithClientOffer(this.peerConnection, this.endpoint)
		})
	}
}

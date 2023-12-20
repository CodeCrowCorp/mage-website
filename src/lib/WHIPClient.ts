import negotiateConnectionWithClientOffer from '$lib/negotiateConnectionWithClientOffer'
import { getAudioIndicator } from '$lib/utils'

/**
 * Example implementation of a client that uses WHIP to broadcast video over WebRTC
 *
 * https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html
 */
export default class WHIPClient extends EventTarget {
	public peerConnection: RTCPeerConnection
	private localScreenStream?: MediaStream
	private localWebcamStream?: MediaStream
	private localAudioStream?: MediaStream

	constructor(private endpoint: string) {
		super()
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

		/**
		 * Listen for negotiationneeded events, and use WHIP as the signaling protocol to establish a connection
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/negotiationneeded_event
		 * https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html
		 */
		this.peerConnection.addEventListener('negotiationneeded', async () => {
			console.log('Connection negotiation starting')
			await negotiateConnectionWithClientOffer(this.peerConnection, this.endpoint)
			console.log('Connection negotiation ended')
		})
	}

	/**
	 * Ask for camera and microphone permissions and
	 * add video and audio tracks to the peerConnection.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	 */
	public async accessLocalScreenMediaSources(canvasElement: HTMLCanvasElement, videoElement: any) {
		try {
			/**
			 * While the connection is being initialized,
			 * connect the video stream to the provided <video> element.
			 */
			navigator.mediaDevices
				.getDisplayMedia({ video: true, audio: true })
				.then(async (stream) => {
					let audioTrack = stream.getAudioTracks()[0]
					if (!audioTrack) {
						const audioContext = new AudioContext()
						const oscillator = audioContext.createOscillator()
						const destination = audioContext.createMediaStreamDestination()
						oscillator.connect(destination)
						oscillator.frequency.setValueAtTime(0, audioContext.currentTime)
						oscillator.start()
						audioTrack = destination.stream.getAudioTracks()[0]
						audioTrack.enabled = true
						// audioTrack.id = 'silent-audio-track'
						// audioTrack.label = 'Silent Audio Track'
					}
					this.peerConnection.addTransceiver(audioTrack, {
						direction: 'sendonly'
					})
					// Add the stream to the canvas and get the canvas stream
					const canvasStream = await this.addStreamToCanvas(
						stream,
						canvasElement,
						videoElement,
						true
					)
					// Add the canvas stream's tracks to the peer connection
					canvasStream.getTracks().forEach((track) => {
						this.peerConnection.addTransceiver(track, {
							direction: 'sendonly'
						})
					})
					stream.getVideoTracks()[0].addEventListener('ended', () => this.disconnectStreamScreen())
					if (stream.getVideoTracks()[0].readyState === 'live') {
						this.dispatchEvent(new CustomEvent(`isScreenLive`, { detail: true }))
					}
					this.localScreenStream = stream
				})
				.catch(() => {
					this.disconnectStreamScreen()
				})
		} catch (error) {
			this.disconnectStreamScreen()
		}
	}

	public async accessLocalWebcamMediaSources(
		canvasElement: HTMLCanvasElement,
		videoElement: HTMLVideoElement
	) {
		try {
			navigator.mediaDevices
				.getUserMedia({ video: true, audio: false })
				.then(async (stream) => {
					// Add the stream to the canvas and get the canvas stream
					const canvasStream = await this.addStreamToCanvas(
						stream,
						canvasElement,
						videoElement,
						false
					)
					// Add the canvas stream's tracks to the peer connection
					canvasStream.getTracks().forEach((track) => {
						this.peerConnection.addTransceiver(track, {
							direction: 'sendonly'
						})
					})
					stream.getVideoTracks()[0].addEventListener('ended', () => this.disconnectStreamWebcam())
					if (stream.getVideoTracks()[0].readyState === 'live') {
						this.dispatchEvent(new CustomEvent(`isWebcamLive`, { detail: true }))
					}
					this.localWebcamStream = stream
				})
				.catch(() => {
					this.disconnectStreamWebcam()
				})
		} catch (error) {
			this.disconnectStreamWebcam()
		}
	}

	public async accessLocalAudioMediaSources(audioElement: any) {
		try {
			navigator.mediaDevices
				.getUserMedia({
					video: false,
					audio: {
						echoCancellation: true,
						noiseSuppression: true,
						deviceId: 'default'
					}
				})
				.then((stream) => {
					stream.getAudioTracks().forEach((track) => {
						this.peerConnection.addTransceiver(track, {
							/** WHIP is only for sending streaming media */
							direction: 'sendonly'
						})
					})
					stream.getAudioTracks()[0].addEventListener('ended', () => {
						this.disconnectStreamAudio()
					})
					getAudioIndicator(stream, this)
					this.localAudioStream = stream
					audioElement.srcObject = stream
				})
				.catch(() => {
					this.disconnectStreamAudio()
				})
		} catch (error) {
			this.disconnectStreamAudio()
		}
	}

	private async addStreamToCanvas(
		stream: MediaStream,
		canvasElement: HTMLCanvasElement,
		videoElement: HTMLVideoElement,
		isScreen: boolean
	): Promise<MediaStream> {
		// Play the stream in the video element
		videoElement.srcObject = stream
		videoElement.play()
		// Draw the video frame to the canvas
		canvasElement.width = 1920
		canvasElement.height = 1080
		const context = canvasElement.getContext('2d')
		const drawVideoFrame = () => {
			if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
				if (isScreen) {
					context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)
					if (this.localWebcamStream) {
						context?.drawImage(
							videoElement,
							canvasElement.width * 0.75,
							canvasElement.height * 0.75,
							canvasElement.width * 0.25,
							canvasElement.height * 0.25
						)
					}
				} else {
					context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)
				}
			}
			requestAnimationFrame(drawVideoFrame)
		}
		drawVideoFrame()
		// Capture the stream from the canvas
		const canvasStream = canvasElement.captureStream(30)
		// Apply constraints to the video track
		const constraints = isScreen
			? {
					width: 1920,
					height: 1080
			  }
			: {
					width: 1280,
					height: 720
			  }
		canvasStream.getVideoTracks()[0].applyConstraints(constraints)

		// Clear the canvas when the stream is disconnected
		stream.getVideoTracks()[0].addEventListener('ended', () => {
			context?.clearRect(0, 0, canvasElement.width, canvasElement.height)
		})
		return canvasStream
	}

	/**
	 * Terminate the streaming session
	 * 1. Notify the WHIP server by sending a DELETE request
	 * 2. Close the WebRTC connection
	 * 3. Stop using the local camera and microphone
	 *
	 * Note that once you call this method, this instance of this WHIPClient cannot be reused.
	 */
	public async disconnectStream() {
		// const response = await fetch(this.endpoint, {
		// 	method: 'DELETE',
		// 	mode: 'cors'
		// })
		this.peerConnection.close()
		console.log('Disconnected')
	}

	public disconnectStreamScreen() {
		this.localScreenStream?.getTracks().forEach((track) => track.stop())
		this.dispatchEvent(new CustomEvent(`localStreamStopped-screen`))
		console.log('Screen stream disconnected')
		if (this.areAllStreamsStopped()) {
			this.disconnectStream()
		}
	}

	public disconnectStreamWebcam() {
		this.localWebcamStream?.getTracks().forEach((track) => track.stop())
		this.dispatchEvent(new CustomEvent(`localStreamStopped-webcam`))
		console.log('Webcam stream disconnected')
		if (this.areAllStreamsStopped()) {
			this.disconnectStream()
		}
	}

	public disconnectStreamAudio() {
		this.localAudioStream?.getTracks().forEach((track) => track.stop())
		this.dispatchEvent(new CustomEvent(`localStreamStopped-audio`))
		console.log('Audio stream disconnected')
		if (this.areAllStreamsStopped()) {
			this.disconnectStream()
		}
	}

	private areAllStreamsStopped(): boolean {
		const screenStopped =
			!this.localScreenStream ||
			this.localScreenStream.getTracks().every((track) => track.readyState === 'ended')
		const webcamStopped =
			!this.localWebcamStream ||
			this.localWebcamStream.getTracks().every((track) => track.readyState === 'ended')
		const audioStopped =
			!this.localAudioStream ||
			this.localAudioStream.getTracks().every((track) => track.readyState === 'ended')

		return screenStopped && webcamStopped && audioStopped
	}
}

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
	private offscreen: OffscreenCanvas | null = null

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
	public async accessLocalScreenMediaSources(
		canvasElement: HTMLCanvasElement,
		screenElement: HTMLVideoElement,
		webcamElement: HTMLVideoElement,
		webcamContainerElement: HTMLDivElement
	) {
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
						screenElement,
						webcamElement,
						webcamContainerElement,
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
				.catch((err) => {
					console.log('got here----1', err)
					this.disconnectStreamScreen()
				})
		} catch (err) {
			console.log('got here----2', err)
			this.disconnectStreamScreen()
		}
	}

	public async accessLocalWebcamMediaSources(
		canvasElement: HTMLCanvasElement,
		screenElement: HTMLVideoElement,
		webcamElement: HTMLVideoElement,
		webcamContainerElement: HTMLDivElement
	) {
		try {
			navigator.mediaDevices
				.getUserMedia({ video: true, audio: false })
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
						screenElement,
						webcamElement,
						webcamContainerElement,
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
					audio: true
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
		screenVideoElement: HTMLVideoElement,
		webcamVideoElement: HTMLVideoElement,
		webcamContainerElement: HTMLDivElement,
		isScreen: boolean
	): Promise<MediaStream> {
		try {
			// Determine which stream is being added
			const videoElement = isScreen ? screenVideoElement : webcamVideoElement
			videoElement.srcObject = stream
			videoElement.play()
			// If the OffscreenCanvas doesn't exist, create it
			if (!this.offscreen) {
				this.offscreen = canvasElement.transferControlToOffscreen()
			}
			// Set the dimensions of the OffscreenCanvas
			this.offscreen.width = 1920
			this.offscreen.height = 1080
			if (isScreen && screenVideoElement.readyState === screenVideoElement.HAVE_ENOUGH_DATA) {
				this.offscreen.width = screenVideoElement.videoWidth
				this.offscreen.height = screenVideoElement.videoHeight
			}
			const worker = new Worker(new URL('./drawVideoFrameWorker.ts', import.meta.url))
			// Transfer the OffscreenCanvas to the worker
			worker.postMessage({ command: 'init', canvas: this.offscreen }, [this.offscreen])

			// Capture the stream from the canvas
			const canvasStream = canvasElement.captureStream(30)

			// Clear the canvas when the stream is disconnected
			stream.getVideoTracks()[0].addEventListener('ended', () => {
				// Send a message to the worker to clear the OffscreenCanvas
				worker.postMessage({ command: 'clear' })
				worker.postMessage({ command: 'stop' })
			})

			const drawVideoFrame = async () => {
				try {
					if (
						screenVideoElement.readyState === screenVideoElement.HAVE_ENOUGH_DATA &&
						screenVideoElement.srcObject !== null &&
						this.offscreen
					) {
						const offscreen = new OffscreenCanvas(
							screenVideoElement.videoWidth,
							screenVideoElement.videoHeight
						)
						const offscreenCanvasCtx: any = offscreen.getContext('bitmaprenderer')
						if (offscreenCanvasCtx) {
							const bitmap = await createImageBitmap(screenVideoElement)
							offscreenCanvasCtx.transferFromImageBitmap(bitmap)
							const transferCanvas = new OffscreenCanvas(
								screenVideoElement.videoWidth,
								screenVideoElement.videoHeight
							)
							const transferCtx = transferCanvas.getContext('2d')
							if (transferCtx) {
								transferCtx.drawImage(offscreen, 0, 0)
							}
							worker.postMessage(
								{
									x: 0,
									y: 0,
									width: transferCanvas.width,
									height: transferCanvas.height
								},
								[transferCanvas]
							)
						}
					} else {
						// Send a message to the worker to clear the OffscreenCanvas
						worker.postMessage({ command: 'clear' })
					}

					if (
						webcamVideoElement.readyState === webcamVideoElement.HAVE_ENOUGH_DATA &&
						this.offscreen
					) {
						// Get the position of the webcamContainerElement relative to the viewport
						const rect = webcamContainerElement.getBoundingClientRect()

						// Get the position of the canvas relative to the viewport
						const canvasRect = canvasElement.getBoundingClientRect()

						// Calculate the position of the webcamContainerElement relative to the canvas
						let x = rect.left - canvasRect.left
						let y = rect.top - canvasRect.top

						// Get the natural size of the webcam video
						let width = webcamVideoElement.videoWidth
						let height = webcamVideoElement.videoHeight

						// If screen is not being shared, make the webcam the size of the canvas
						if (screenVideoElement.srcObject === null) {
							// Calculate the aspect ratio of the webcam video
							const aspectRatio = webcamVideoElement.videoWidth / webcamVideoElement.videoHeight

							// Calculate the new width and height based on the aspect ratio
							if (this.offscreen.width / aspectRatio <= this.offscreen.height) {
								width = this.offscreen.width
								height = this.offscreen.width / aspectRatio
							} else {
								width = this.offscreen.height * aspectRatio
								height = this.offscreen.height
							}

							// Center the webcam video on the canvas
							x = (this.offscreen.width - width) / 2
							y = (this.offscreen.height - height) / 2
						}

						// Check if the webcam video is outside the canvas boundaries and adjust the position if necessary
						if (x < 0) x = 0
						if (y < 0) y = 0
						if (x + width > this.offscreen.width) x = this.offscreen.width - width
						if (y + height > this.offscreen.height) y = this.offscreen.height - height

						// Draw the webcam video at the updated position and with its natural size
						const webcamBitmap = await createImageBitmap(webcamVideoElement)
						worker.postMessage(
							{
								bitmap: webcamBitmap,
								x,
								y,
								width,
								height
							},
							[webcamBitmap] // Only transfer the bitmap
						)
					}

					requestAnimationFrame(drawVideoFrame)
				} catch (error) {
					console.log('Error in drawVideoFrame: ', error)
				}
			}
			drawVideoFrame()

			return canvasStream
		} catch (error) {
			console.log('got here----addStreamToCanvas error', error)
			return new MediaStream()
		}
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

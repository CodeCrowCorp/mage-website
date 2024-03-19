import negotiateConnectionWithClientOffer from '$lib/negotiateConnectionWithClientOffer'
import { getAudioIndicator } from '$lib/utils'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

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
	private localWebrtcStream?: MediaStream

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
		webrtcElement: HTMLVideoElement,
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
					// Add the stream to the media and get the combined stream
					await this.addStreamToMedia(
						stream,
						webrtcElement,
						screenElement,
						webcamElement,
						webcamContainerElement,
						true
					)
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
		webrtcElement: HTMLVideoElement,
		screenElement: HTMLVideoElement,
		webcamElement: HTMLVideoElement,
		webcamContainerElement: HTMLDivElement
	) {
		try {
			navigator.mediaDevices
				.getUserMedia({ video: true, audio: false })
				.then(async (stream) => {
					// Add the stream to the media and get the combined stream
					await this.addStreamToMedia(
						stream,
						webrtcElement,
						screenElement,
						webcamElement,
						webcamContainerElement,
						false
					)
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

	private async addStreamToMedia(
		stream: MediaStream,
		webrtcVideoElement: any,
		screenVideoElement: HTMLVideoElement,
		webcamVideoElement: HTMLVideoElement,
		webcamContainerElement: HTMLDivElement,
		isScreen: boolean
	) {
		try {
			if (!this.localWebrtcStream) {
				this.localWebrtcStream = new MediaStream()
			}

			if (isScreen) {
				screenVideoElement.srcObject = stream
			} else {
				webcamVideoElement.srcObject = stream
			}

			stream.getTracks().forEach((track) => {
				if (!track.onended) {
					track.onended = () => {
						this.addStreamToMedia(
							stream,
							webrtcVideoElement,
							screenVideoElement,
							webcamVideoElement,
							webcamContainerElement,
							isScreen
						)
					}
				}
			})

			// Check if screen stream is present
			if (
				isScreen &&
				screenVideoElement?.srcObject instanceof MediaStream &&
				!this.localWebrtcStream?.getTracks().length
			) {
				// If screen stream is present, add the screen stream to the localWebrtcStream
				stream.getTracks().forEach((track) => {
					this.localWebrtcStream?.addTrack(track)
				})
			}
			// Check if webcam stream is present
			else if (
				!isScreen &&
				webcamVideoElement?.srcObject instanceof MediaStream &&
				!this.localWebrtcStream?.getTracks().length
			) {
				// If webcam stream is present, add the webcam stream to the localWebrtcStream
				stream.getTracks().forEach((track) => {
					this.localWebrtcStream?.addTrack(track)
				})
			}
			// Check if both streams are present
			else if (
				screenVideoElement?.srcObject instanceof MediaStream &&
				webcamVideoElement?.srcObject instanceof MediaStream
			) {
				this.localWebrtcStream?.getTracks().forEach((track: any) => {
					this.localWebrtcStream?.removeTrack(track)
				})
				// Combine the streams using ffmpeg.wasm
				const ffmpeg = new FFmpeg()
				const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
				await ffmpeg.load({
					coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
					wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
					workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
				})

				const screenStream = screenVideoElement.srcObject as MediaStream
				const webcamStream = webcamVideoElement.srcObject as MediaStream

				const screenRecorder = new MediaRecorder(screenStream)
				const webcamRecorder = new MediaRecorder(webcamStream)

				let screenVideoURL: string
				let webcamVideoURL: string

				screenRecorder.ondataavailable = async (e) => {
					const screenBlob = new Blob([e.data], { type: 'video/mp4' })
					screenVideoURL = URL.createObjectURL(screenBlob)
					await this.combineAndSendStreams(
						ffmpeg,
						screenVideoURL,
						webcamVideoURL,
						webrtcVideoElement
					)
				}

				webcamRecorder.ondataavailable = async (e) => {
					const webcamBlob = new Blob([e.data], { type: 'video/mp4' })
					webcamVideoURL = URL.createObjectURL(webcamBlob)
					await this.combineAndSendStreams(
						ffmpeg,
						screenVideoURL,
						webcamVideoURL,
						webrtcVideoElement
					)
				}
				screenRecorder.start()
				webcamRecorder.start()
			}

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

			// Add the media stream's tracks to the peer connection
			this.localWebrtcStream?.getTracks().forEach((newTrack) => {
				const senders = this.peerConnection.getSenders()
				const existingSender = senders.find((sender) => sender.track?.kind === newTrack.kind)

				if (existingSender) {
					// Replace the existing track with the new one
					existingSender.replaceTrack(newTrack)
				} else {
					// Add the new track to the peer connection
					this.peerConnection.addTransceiver(newTrack, {
						direction: 'sendonly'
					})
				}
			})
		} catch (error) {
			console.log('got here----addStreamToMedia error', error)
			return new MediaStream()
		}
	}

	private async combineAndSendStreams(
		ffmpeg: any,
		screenVideoURL: string,
		webcamVideoURL: string,
		webrtcVideoElement: any
	) {
		await ffmpeg.exec([
			'-i',
			screenVideoURL,
			'-i',
			webcamVideoURL,
			'-filter_complex',
			'[1]scale=iw/4:ih/4 [pip]; [0][pip] overlay=W-w-10:H-h-10',
			'output.mp4'
		])

		const data: any = await ffmpeg.readFile('output.mp4')
		let dataBuffer
		if (typeof data === 'string') {
			const encoder = new TextEncoder()
			dataBuffer = encoder.encode(data)
		} else {
			dataBuffer = data
		}
		const outputBlob = new Blob([dataBuffer], { type: 'video/mp4' })
		const outputURL = URL.createObjectURL(outputBlob)

		webrtcVideoElement.src = outputURL
		await webrtcVideoElement.play()

		const outputStream = webrtcVideoElement.captureStream(60)
		outputStream.getTracks().forEach((track: any) => {
			this.localWebrtcStream?.addTrack(track)
		})
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

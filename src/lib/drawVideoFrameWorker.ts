interface InitData {
	command: 'init'
	canvas: OffscreenCanvas
}

interface ClearData {
	command: 'clear'
}

interface StopData {
	command: 'stop'
}

interface DrawData {
	canvas: OffscreenCanvas
	screenVideoElement: HTMLVideoElement
}

type WorkerData = InitData | ClearData | DrawData | StopData

let canvas: OffscreenCanvas | null = null

self.onmessage = (event: { data: WorkerData }) => {
	try {
		if ('command' in event.data) {
			if (event.data.command === 'init') {
				// Receive the OffscreenCanvas
				canvas = event.data.canvas
			} else if (event.data.command === 'clear') {
				const context = canvas?.getContext('2d')
				context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0)
			} else if (event.data.command === 'stop') {
				// Stop the worker
				self.close()
			}
		} else {
			const { screenVideoElement } = event.data as DrawData
			const context = canvas?.getContext('2d')

			// Perform the drawVideoFrame operation
			context?.drawImage(screenVideoElement, 0, 0, canvas?.width || 1920, canvas?.height || 1080)
			console.log('self.onmessage')

			// Do not post the OffscreenCanvas back to the main thread
			// If you need to send some information back to the main thread, send a message without the OffscreenCanvas
			// For example, you can send a message indicating that the draw operation has been completed
			self.postMessage({ status: 'drawCompleted' })
		}
	} catch (err) {
		console.error(err)
	}
}

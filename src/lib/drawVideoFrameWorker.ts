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
	x: number
	y: number
	width: number
	height: number
}

type WorkerData = InitData | ClearData | DrawData | StopData

let canvas: OffscreenCanvas | null = null
let context: OffscreenCanvasRenderingContext2D | null = null

self.onmessage = (event: { data: WorkerData }) => {
	try {
		if ('command' in event.data) {
			if (event.data.command === 'init') {
				// Receive the OffscreenCanvas
				canvas = event.data.canvas
				context = canvas.getContext('2d')
			} else if (event.data.command === 'clear') {
				context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0)
			} else if (event.data.command === 'stop') {
				// Stop the worker
				self.close()
			}
		} else {
			if (canvas && context) {
				const { x, y, width, height } = event.data as DrawData

				// Perform the drawVideoFrame operation
				// The image data has already been transferred onto the OffscreenCanvas
				context?.drawImage(canvas, x, y, width, height)
				console.log('self.onmessage')

				// Do not post the OffscreenCanvas back to the main thread
				// If you need to send some information back to the main thread, send a message without the OffscreenCanvas
				// For example, you can send a message indicating that the draw operation has been completed
				self.postMessage({ status: 'drawCompleted' })
			}
		}
	} catch (err) {
		console.error(err)
	}
}

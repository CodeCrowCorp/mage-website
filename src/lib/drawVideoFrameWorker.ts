interface InitData {
	command: 'init'
	canvas: OffscreenCanvas
}

interface ClearData {
	command: 'clear'
}

interface DrawData {
	canvas: OffscreenCanvas
	bitmap: ImageBitmap
	x: number
	y: number
	width: number
	height: number
}

type WorkerData = InitData | ClearData | DrawData

let canvas: OffscreenCanvas | null = null

self.onmessage = (event: { data: WorkerData }) => {
	try {
		if ('command' in event.data) {
			if (event.data.command === 'init') {
				console.log('got here----command-init')
				// Receive the OffscreenCanvas
				canvas = event.data.canvas
			} else if (event.data.command === 'clear') {
				console.log('got here----command-clear')
				const context = canvas?.getContext('2d')
				context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0)
			}
		} else {
			const { bitmap, x, y, width, height } = event.data as DrawData
			const context = canvas?.getContext('2d')

			// Perform the drawVideoFrame operation
			context?.drawImage(bitmap, x, y, width, height)
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

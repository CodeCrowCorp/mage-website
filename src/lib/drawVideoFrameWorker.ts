interface WorkerData {
	canvas: OffscreenCanvas
	bitmap: ImageBitmap
	x: number
	y: number
	width: number
	height: number
}
let canvas: OffscreenCanvas | null = null

self.onmessage = (event: { data: WorkerData | { command: string } }) => {
	if ('command' in event.data && event.data.command === 'clear') {
		const context = canvas?.getContext('2d')
		context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0)
	} else if ('canvas' in event.data) {
		const { canvas: canvasData, bitmap, x, y, width, height } = event.data as WorkerData
		canvas = canvasData
		const context = canvas.getContext('2d')

		// Perform the drawVideoFrame operation
		context?.drawImage(bitmap, x, y, width, height)

		// Do not post the OffscreenCanvas back to the main thread
		// If you need to send some information back to the main thread, send a message without the OffscreenCanvas
		// For example, you can send a message indicating that the draw operation has been completed
		self.postMessage({ status: 'drawCompleted' })
	}
}

declare const workerSelf: Worker
interface WorkerData {
	canvas: OffscreenCanvas
	bitmap: ImageBitmap
	x: number
	y: number
	width: number
	height: number
}

workerSelf.onmessage = (event: { data: WorkerData }) => {
	const { canvas, bitmap, x, y, width, height } = event.data
	const context = canvas.getContext('2d')

	// Perform the drawVideoFrame operation
	context?.drawImage(bitmap, x, y, width, height)

	workerSelf.postMessage(canvas)
}

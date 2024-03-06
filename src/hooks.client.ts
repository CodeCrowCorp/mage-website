// import type { Handle } from '@sveltejs/kit'
// import { get } from '$lib/api'
// import { platformConnection, platformMessage } from '$lib/stores/websocketStore'
// import { platformSocket, initPlatformSocket } from '$lib/websocket'

// export const handle = async ({ event, resolve }: { event: any; resolve: any }) => {
// 	const platformSocketId = await get(`wsinit/wsid`)
// 	initPlatformSocket(platformSocketId)
// 	console.log('platformSocketId', platformSocketId)
// 	return await resolve(event, { ssr: false })
// }

// export const handleError = (({ error, event }) => {
//     const errorId = crypto.randomUUID();
//     // example integration with https://sentry.io/
//     // Sentry.captureException(error, { event, errorId })

//     return {
//         message: 'Whoops!',
//         errorId
//     };
// }) satisfies HandleClientError

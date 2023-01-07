import type { Handle, HandleClientError } from '@sveltejs/kit'

// // export const handle = (({ event, resolve }) => {
// // })

// export const handleError = (({ error, event }) => {
//     const errorId = crypto.randomUUID();
//     // example integration with https://sentry.io/
//     // Sentry.captureException(error, { event, errorId })

//     return {
//         message: 'Whoops!',
//         errorId
//     };
// }) satisfies HandleClientError
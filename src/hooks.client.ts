import { env } from '$env/dynamic/public'
import { init } from '@jill64/sentry-sveltekit-cloudflare/client'
import * as Sentry from '@sentry/browser'

const onError = init(env.PUBLIC_SENTRY_DSN || '', {
	sentryOptions: {
		tunnel: '/tunnel',
		integrations: [
			Sentry.browserTracingIntegration(),
			Sentry.browserProfilingIntegration(),
			Sentry.replayIntegration()
		],
		tracesSampleRate: 1.0,
		profilesSampleRate: 1.0,
		// we only care about errors
		replaysSessionSampleRate: 0,
		replaysOnErrorSampleRate: 1.0
	},
	enableInDevMode: false
})

export const handleError = onError((e, sentryEventId) => {
	// no special error handling
})

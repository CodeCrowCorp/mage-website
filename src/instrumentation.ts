import { withOpenTelemetry } from '@baselime/sveltekit-opentelemetry-middleware'
import { BaselimeSDK } from '@baselime/node-opentelemetry'

new BaselimeSDK({}).start()

export const handle = withOpenTelemetry(async ({ event, resolve }) => resolve(event))

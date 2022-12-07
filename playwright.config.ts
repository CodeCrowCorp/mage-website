import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
    reporter: [['json', { outputFile: 'e2eresults.json' }]],
    webServer: {
        command: 'npm run build && npm run preview',
        port: 4173,
        timeout: 240000,
        reuseExistingServer: !process.env.CI,
    },
    workers: process.env.CI ? 4 : undefined
}

export default config

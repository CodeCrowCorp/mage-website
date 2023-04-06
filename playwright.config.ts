import { defineConfig }  from '@playwright/test'

export default defineConfig({
    reporter: [['json', { outputFile: 'e2eresults.json' }]],
    webServer: {
        command: 'npm run dev',
        port:5173,
        timeout: 240000,
        reuseExistingServer: !process.env.CI,
    },
    use: {
        baseURL: 'http://localhost:5173/',
    },
    workers: process.env.CI ? 4 : undefined
});

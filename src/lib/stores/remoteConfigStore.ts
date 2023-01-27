import { env } from '$env/dynamic/public'
import { writable, type Writable } from 'svelte/store'
import { getHeaders } from '$lib/stores/helperStore'

export const isMaintenanceModeEnabled: Writable<boolean> = writable(false)
export const isFeatureVideoResponsesEnabled: Writable<boolean> = writable(false)
export const isFeatureGroupChatEnabled: Writable<boolean> = writable(false)
export const isFeatureMintPageEnabled: Writable<boolean> = writable(false)
export const isFeaturePremiumPageEnabled: Writable<boolean> = writable(false)

async function createRemoteConfig({ flagKey, flagValue }: { flagKey: string; flagValue: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/remote-config`, {
        method: 'PUT',
        body: JSON.stringify({ flagKey, flagValue }),
        headers: getHeaders()
    }).then(response => response.json())
}

async function getRemoteConfigs() {
    return await fetch(`${env.PUBLIC_API_URL}/remote-configs`, {
        method: 'GET'
        ,
        headers: getHeaders()
    }).then(async response => {
        const remoteConfigs = await response.json()
        remoteConfigs.map((config: { flagKey: string; flagValue: boolean }) => {
            if (config.flagKey === 'maintenance-mode') isMaintenanceModeEnabled.set(config.flagValue)
            if (config.flagKey === 'feature-video-responses')
                isFeatureVideoResponsesEnabled.set(config.flagValue)
            if (config.flagKey === 'feature-group-chat') isFeatureGroupChatEnabled.set(config.flagValue)
            if (config.flagKey === 'feature-mint-page') isFeatureMintPageEnabled.set(config.flagValue)
            if (config.flagKey === 'feature-premium-page')
                isFeaturePremiumPageEnabled.set(config.flagValue)
        })
    })
}

async function getRemoteConfigByKey({ flagKey }: { flagKey: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/remote-config?flagKey=${flagKey}`, {
        method: 'GET'
        ,
        headers: getHeaders()
    }).then(response => response.json())
}

export {
    createRemoteConfig,
    getRemoteConfigs,
    getRemoteConfigByKey
}

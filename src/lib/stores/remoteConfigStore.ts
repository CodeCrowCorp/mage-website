import { env } from '$env/dynamic/public'
import { writable, type Writable } from "svelte/store"

class RemoteConfigStore {
    constructor(
        public isMaintenanceModeEnabled: Writable<boolean> = writable(false),
        public isFeatureVideoResponsesEnabled: Writable<boolean> = writable(false),
        public isFeatureGroupChatEnabled: Writable<boolean> = writable(false),
        public isFeatureMintPageEnabled: Writable<boolean> = writable(false),
        public isFeaturePremiumPageEnabled: Writable<boolean> = writable(false)
    ) {}

    public async createRemoteConfig({ flagKey, flagValue }: { flagKey: string, flagValue: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/remote-config`, {
            method: 'PUT',
            body: JSON.stringify({ flagKey, flagValue })
        }).then(response => response.json())
    }

    public async getRemoteConfigs() {
        return await fetch(`${env.PUBLIC_API_URL}/remote-config`, {
            method: 'GET'
        }).then(async response => {
            const remoteConfigs = await response.json()
            remoteConfigs.map((config: { flagKey: string; flagValue: boolean }) => {
                if (config.flagKey === 'maintenance-mode') this.isMaintenanceModeEnabled.set(config.flagValue)
                if (config.flagKey === 'feature-video-responses') this.isFeatureVideoResponsesEnabled.set(config.flagValue)
                if (config.flagKey === 'feature-group-chat') this.isFeatureGroupChatEnabled.set(config.flagValue)
                if (config.flagKey === 'feature-mint-page') this.isFeatureMintPageEnabled.set(config.flagValue)
                if (config.flagKey === 'feature-premium-page') this.isFeaturePremiumPageEnabled.set(config.flagValue)
            })
        })
    }

    public async getRemoteConfigByKey({ flagKey }: { flagKey: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/remote-config?flagKey=${flagKey}`, {
            method: 'GET'
        }).then(response => response.json())
    }
}

export const remoteConfigStore = new RemoteConfigStore()
import { env } from '$env/dynamic/public'
import { writable, type Writable } from 'svelte/store'

export const is_maintenance_mode_enabled: Writable<boolean> = writable(false)
export const is_feature_video_responses_enabled: Writable<boolean> = writable(false)
export const is_feature_group_chat_enabled: Writable<boolean> = writable(false)
export const is_feature_mint_page_enabled: Writable<boolean> = writable(false)
export const is_feature_premium_page_enabled: Writable<boolean> = writable(false)

async function createRemoteConfig({ flagKey, flagValue }: { flagKey: string; flagValue: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/remote-config`, {
		method: 'PUT',
		body: JSON.stringify({ flagKey, flagValue })
	}).then((response) => response.json())
}

async function getRemoteConfigs() {
	return await fetch(`${env.PUBLIC_API_URL}/remote-configs`, {
		method: 'GET'
	}).then(async (response) => {
		const remoteConfigs = await response.json()
		remoteConfigs.map((config: { flagKey: string; flagValue: boolean }) => {
			if (config.flagKey === 'maintenance-mode') is_maintenance_mode_enabled.set(config.flagValue)
			if (config.flagKey === 'feature-video-responses')
				is_feature_video_responses_enabled.set(config.flagValue)
			if (config.flagKey === 'feature-group-chat')
				is_feature_group_chat_enabled.set(config.flagValue)
			if (config.flagKey === 'feature-mint-page') is_feature_mint_page_enabled.set(config.flagValue)
			if (config.flagKey === 'feature-premium-page')
				is_feature_premium_page_enabled.set(config.flagValue)
		})
	})
}

async function getRemoteConfigByKey({ flagKey }: { flagKey: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/remote-config?flagKey=${flagKey}`, {
		method: 'GET'
	}).then((response) => response.json())
}

export { createRemoteConfig, getRemoteConfigs, getRemoteConfigByKey }

import { writable, type Writable } from 'svelte/store'

export const is_feature_video_responses_enabled: Writable<boolean> = writable(false)
export const is_feature_affiliate_enabled: Writable<boolean> = writable(false)
export const is_feature_apps_enabled: Writable<boolean> = writable(false)
export const is_feature_restream_enabled: Writable<boolean> = writable(false)

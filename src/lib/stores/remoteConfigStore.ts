import { writable, type Writable } from 'svelte/store'

export const is_feature_video_responses_enabled: Writable<boolean> = writable(false)
export const is_feature_premium_enabled: Writable<boolean> = writable(false)
export const is_feature_apps_enabled: Writable<boolean> = writable(false)
export const is_feature_merge_platforms_enabled: Writable<boolean> = writable(false)
export const is_feature_merch_enabled: Writable<boolean> = writable(false)

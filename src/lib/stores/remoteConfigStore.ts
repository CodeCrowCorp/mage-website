import { writable, type Writable } from 'svelte/store'

export const is_feature_video_responses_enabled: Writable<boolean> = writable(false)
export const is_feature_premium_enabled: Writable<boolean> = writable(false)
export const is_feature_apps_enabled: Writable<boolean> = writable(false)
export const is_feature_studio_mode_enabled: Writable<boolean> = writable(false)

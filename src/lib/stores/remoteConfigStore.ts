import { writable, type Writable } from 'svelte/store'

export const is_feature_video_responses_enabled: Writable<boolean> = writable(false)
export const is_feature_premium_page_enabled: Writable<boolean> = writable(false)
export const is_feature_follows_enabled: Writable<boolean> = writable(false)
export const is_feature_stats_enabled: Writable<boolean> = writable(false)
export const is_feature_affiliate_enabled: Writable<boolean> = writable(false)

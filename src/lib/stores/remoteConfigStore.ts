import { writable, type Writable } from 'svelte/store'

export const is_maintenance_mode_enabled: Writable<boolean> = writable(false)
export const is_feature_video_responses_enabled: Writable<boolean> = writable(false)
export const is_feature_group_chat_enabled: Writable<boolean> = writable(false)
export const is_feature_mint_page_enabled: Writable<boolean> = writable(false)
export const is_feature_premium_page_enabled: Writable<boolean> = writable(false)

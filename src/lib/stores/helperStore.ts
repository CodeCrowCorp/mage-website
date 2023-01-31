import { writable, type Writable } from 'svelte/store'
import { env } from '$env/dynamic/public'

export const login_modal: Writable<any> = writable(null)

export const getHeaders = () => {
	const headers: any = {
		// userId: localStorage.getItem('userId')
	}
	if (env.PUBLIC_CROSS_ORIGIN === 'false') {
		// headers['authorization'] = localStorage.getItem('token')
	} else {
		headers['x-api-key'] = env.PUBLIC_API_KEY
	}
	return headers
}

export const levelFromExp = (exp: number): number => {
	let level = 1
	let totalExp = 0
	while (exp >= totalExp) {
		level++
		totalExp = Math.floor((50 * level * (level + 1)) / 2)
	}
	return level - 1
}

export const barValueFromExp = (exp: number): number => {
	let currentXP = 0
	let targetXP = 0

	for (let i = 1; i < exp; i++) {
		currentXP += Math.floor(i + 300 * Math.pow(2, i / 7))
	}

	for (let i = 1; i < exp + 1; i++) {
		targetXP += Math.floor(i + 300 * Math.pow(2, i / 7))
	}

	const difference = targetXP - currentXP
	return (difference / targetXP) * 100
}

export const colorFromLevel = (level: number): string => {
	const hue = (360 * (level * 0.6180339887498949)) % 360
	return `hsl(${hue}, 100%, 50%)`
}

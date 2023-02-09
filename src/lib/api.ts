import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

const base = env.PUBLIC_API_URL

async function send({
	method,
	path,
	data,
	headers
}: {
	method: string
	path: string
	data?: any
	headers?: any
}) {
	const opts: any = { method, headers: {} }

	if (data) {
		opts.headers['Content-Type'] = 'application/json'
		opts.body = JSON.stringify(data)
	}

	// if headers sent manually
	if (headers && headers.userId) {
		opts.headers['userId'] = headers.userId
	}

	if (env.PUBLIC_CROSS_ORIGIN === 'false') {
		if (headers && headers.token) {
			opts.headers['Authorization'] = headers.token
		}
	} else {
		opts.headers['x-api-key'] = env.PUBLIC_X_API_KEY
	}

	const res = await fetch(`${base}/${path}`, opts)
	if (res.ok || res.status === 422) {
		const text = await res.text()
		if (path === 'wsinit/wsid' || path.includes('wsinit/channelid')) return text
		return text ? JSON.parse(text) : {}
	}

	return { error: res.status }
}

export function get(path: string, headers?: any) {
	return send({ method: 'GET', path, headers })
}

export function del(path: string, headers?: any) {
	return send({ method: 'DELETE', path, headers })
}

export function post(path: string, data: any, headers?: any) {
	return send({ method: 'POST', path, data, headers })
}

export function patch(path: string, data: any, headers?: any) {
	return send({ method: 'PATCH', path, data, headers })
}

export function put(path: string, data: any = {}, headers?: any) {
	return send({ method: 'PUT', path, data, headers })
}

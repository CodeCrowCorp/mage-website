import {
	PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
	PUBLIC_GOOGLE_OAUTH_REDIRECT_URL,
	PUBLIC_GITHUB_OAUTH_CLIENT_ID,
	PUBLIC_GITHUB_OAUTH_REDIRECT_URL,
	PUBLIC_DISCORD_OAUTH_CLIENT_ID,
	PUBLIC_DISCORD_OAUTH_REDIRECT_URL
} from '$env/static/public'

export const getGoogleUrl = (from: string) => {
	const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`

	const options = {
		client_id: PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
		redirect_uri: PUBLIC_GOOGLE_OAUTH_REDIRECT_URL,
		access_type: 'offline',
		response_type: 'code',
		prompt: 'consent',
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		].join(' '),
		state: from
	}

	const qs = new URLSearchParams(options)

	return `${rootUrl}?${qs.toString()}`
}

export const getGitHubUrl = (from: string) => {
	const rootURl = 'https://github.com/login/oauth/authorize'

	const options = {
		client_id: PUBLIC_GITHUB_OAUTH_CLIENT_ID,
		redirect_uri: PUBLIC_GITHUB_OAUTH_REDIRECT_URL,
		scope: 'user:email',
		state: from
	}

	const qs = new URLSearchParams(options)

	return `${rootURl}?${qs.toString()}`
}

export const getDiscordUrl = (from: string) => {
	const rootURl = 'https://discord.com/api/oauth2/authorize'

	const options = {
		client_id: PUBLIC_DISCORD_OAUTH_CLIENT_ID,
		redirect_uri: PUBLIC_DISCORD_OAUTH_REDIRECT_URL,
		scope: 'identify email',
		response_type: 'code',
		state: from
	}

	const qs = new URLSearchParams(options)

	return `${rootURl}?${qs.toString()}`
}

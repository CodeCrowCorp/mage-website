const USER_COTEXT = 'user'
const ADMIN_COTEXT = 'admin'

const routes: any = {
	admin: [
		{ path: '/admins', access: [ADMIN_COTEXT] },
		{ path: '/channels', access: [ADMIN_COTEXT] },
		{ path: '/fun-facts', access: [ADMIN_COTEXT] },
		{ path: '/legal', access: [ADMIN_COTEXT] },
		{ path: '/settings', access: [ADMIN_COTEXT] },
		{ path: '/users', access: [ADMIN_COTEXT] }
	],
	browse: [
		{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] },
		{ path: '/(.*)/$', access: [USER_COTEXT, ADMIN_COTEXT] }
	],
	channel: [
		{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] },
		{ path: '/(.*)/$', access: [USER_COTEXT, ADMIN_COTEXT] }
	],
	profile: [
		{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] },
		{ path: '/(.*)/$', access: [USER_COTEXT, ADMIN_COTEXT] }
	],
	search: [
		{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] },
		{ path: '/(.*)/', access: [USER_COTEXT, ADMIN_COTEXT] }
	],
	maintenance: [{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] }],
	settings: [{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] }],
	premium: [{ path: '/', access: [ADMIN_COTEXT] }],
	careers: [{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] }],
	contact: [{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] }],
	videos: [{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] }],
	legal: [{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] }],
	logout: [{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] }],
	'creator-space': [{ path: '/', access: [USER_COTEXT, ADMIN_COTEXT] }]
}

export default routes

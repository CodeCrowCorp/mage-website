const user_contexts = ['*']
const admin_contexts = ['admin']

const routes = {
	admin: [
		{ path: '/admins', access: admin_contexts },
		{ path: '/channels', access: admin_contexts },
		{ path: '/fun-facts', access: admin_contexts },
		{ path: '/fun-facts', access: admin_contexts },
		{ path: '/legal', access: admin_contexts },
		{ path: '/settings', access: admin_contexts },
		{ path: '/users', access: admin_contexts }
	],
	browse: [
		{ path: '/', access: user_contexts },
		{ path: '/(.*)/$', access: user_contexts }
	],
	channel: [
		{ path: '/', access: user_contexts },
		{ path: '/(.*)/$', access: user_contexts }
	],
	profile: [
		{ path: '/', access: admin_contexts },
		{ path: '/(.*)/$', access: admin_contexts }
	],
	search: [
		{ path: '/', access: user_contexts },
		{ path: '/(.*)/', access: user_contexts }
	],
	maintenance: [{ path: '/', access: user_contexts }],
	settings: [{ path: '/', access: user_contexts }],
	premium: [{ path: '/', access: admin_contexts }],
	careers: [{ path: '/', access: user_contexts }],
	contact: [{ path: '/', access: user_contexts }],
	videos: [{ path: '/', access: user_contexts }],
	legal: [{ path: '/', access: user_contexts }],
	'creator-space': [{ path: '/', access: user_contexts }]
}

export default routes

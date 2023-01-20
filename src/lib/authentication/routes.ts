const routes = {
	admin: [
		{ path: '/admins', access: ['admin'] },
		{ path: '/channels', access: ['admin'] },
		{ path: '/fun-facts', access: ['admin'] },
		{ path: '/fun-facts', access: ['admin'] },
		{ path: '/legal', access: ['admin'] },
		{ path: '/settings', access: ['admin'] },
		{ path: '/users', access: ['admin'] }
	],
	browse: [
		{ path: '/', access: ['*'] },
		{ path: '/(.*)/$', access: ['*'] }
	]
}

export default routes

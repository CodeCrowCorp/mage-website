import routes from './routes'

function Authenticate(pathname, user_role) {
	for (const section in routes) {
		for (const sub_section in routes[section]) {
			const route = routes[section][sub_section]
			const route_access = route['access']
			const pattern = new RegExp(`^/${section}${route.path}`, 'i')
			if (pattern.test(pathname + '/') && route_access.includes(user_role)) {
				return true
			}
		}
	}
	return false
}

export { Authenticate }

<script lang="ts">
	import '../app.css'

	export async function load({ page, session }: { page: any; session: any }) {
		const isAdminPage = /^\/admin\/(.*)/.test(page.path)
		const isHomePage = /^\/home\/(.*)/.test(page.path)
		const isProfilePage = /^\/profile\/(.*)/.test(page.path)
		const isPremiumPage = /^\/premium\/(.*)/.test(page.path)
		const isChannelDetailsPage = /^\/channel\/(.*)/.test(page.path)
		const isMaintenanceModeEnabled = true
		if (
			!session.user &&
			(isAdminPage || isHomePage || isProfilePage || isPremiumPage || isChannelDetailsPage)
		) {
			return {
				status: 302,
				redirect: '/login'
			}
		} else {
			if (isMaintenanceModeEnabled) {
				if (!session.user.isAdmin) {
					return {
						status: 302,
						redirect: '/maintenance'
					}
				} else return { props: {} }
			} else return { props: {} }
		}
	}
</script>

<slot />

<script lang="ts">
	import '$lib/assets/styles/tailwind-output.css'

	export async function load({ page, session }: { page: any; session: any }) {
		const isAdminPage = /^\/admin\/(.*)/.test(page.path)
		const isHomePage = /^\/home\/(.*)/.test(page.path)
		const isProfilePage = /^\/profile\/(.*)/.test(page.path)
		const isPremiumPage = /^\/premium\/(.*)/.test(page.path)
		const isChannelPage = /^\/channel\/(.*)/.test(page.path)
		const isMaintenanceModeEnabled = true
		if (
			!session.user &&
			(isAdminPage || isHomePage || isProfilePage || isPremiumPage || isChannelPage)
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

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
		rel="stylesheet" />
</svelte:head>

<slot />

<!-- <style global>
	:root {
		--color-default: #ffffff;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--my-color: #25252a;
		}
	}
	[data-theme='dark'] {
		--color-default: #25252a;
	}
	[data-theme='light'] {
		--my-color: #ffffff;
	}
	body {
		background-color: var(--color-default);
	}
</style> -->

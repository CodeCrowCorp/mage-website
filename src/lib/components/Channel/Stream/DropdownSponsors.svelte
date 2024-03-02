<script lang="ts">
	import { page } from '$app/stores'
	import Viewer from '$lib/components/Channel/Stream/Viewer.svelte'
	import { getColoredRole, setRole } from '$lib/utils'
	import { onMount } from 'svelte'

	export let channel: any

	let viewers: any = []

	onMount(() => {
		let users = channel.sponsors.map((user: any) => {
			user.userId = user.userId || 'anonymous'
			user.username = user.username || 'anonymous'
			const role = setRole({
				userId: user.userId,
				channel,
				currentUserId: $page.data.user?.userId
			})
			user.role = role
			user.coloredRole = getColoredRole(role)
			return user
		})
		viewers = users.reduce((acc: any, cur: any) => {
			let username = cur.username.toLowerCase()
			if (!acc.find((viewer: any) => viewer.username.toLowerCase() === username)) {
				acc.push(cur)
			}
			return acc
		}, [])
	})
</script>

<ul
	tabindex="-1"
	class="dropdown-content p-2 shadow rounded-box m-3 flex flex-col h-fit w-52 z-20 bg-base-300">
	{#each viewers as user}
		<Viewer {user} />
	{/each}
</ul>

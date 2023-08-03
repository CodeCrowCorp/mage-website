<script lang="ts">
	import Viewer from '$lib/components/Channel/Stream/Viewer.svelte'
	import { channel_connection, channel_message } from '$lib/stores/websocketStore'
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import { emitGetConnectedUsers } from '$lib/websocket'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { getColoredRole, setRole } from '$lib/utils'

	export let viewers: any = [],
		channel: any
	let cursor = 0

	onMount(() => {
		if (
			$channel_connection === `open-${channel._id}` &&
			channel.socket?.readyState === WebSocket.OPEN
		) {
			emitGetConnectedUsers({ channelSocket: channel.socket, cursor })
		}
	})

	const loadMore = () => {
		emitGetConnectedUsers({ channelSocket: channel.socket, cursor })
	}

	channel_message.subscribe((value) => {
		if (!value) return
		var parsedMsg = JSON.parse(value)
		if (parsedMsg.eventName === `channel-paginated-users-${channel?._id}`) {
			let users = parsedMsg.users.map((user: any) => {
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
			cursor = parsedMsg.cursor
		}

		if (parsedMsg.eventName === `channel-subscribe-${channel?.id}`) {
			emitGetConnectedUsers({ channelSocket: channel.socket, cursor })
		}
	})
</script>

<ul
	tabindex="-1"
	class="dropdown-content p-2 shadow rounded-box m-3 flex flex-col h-fit w-52 z-20 bg-base-300">
	{#each viewers as user}
		<Viewer {user} />
	{/each}
	<li use:LastItemInViewport on:loadMore={loadMore} />
</ul>

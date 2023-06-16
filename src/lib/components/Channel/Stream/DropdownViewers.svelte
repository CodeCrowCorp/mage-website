<script lang="ts">
	import Viewer from '$lib/components/Channel/Stream/Viewer.svelte'
	import { channel_message } from '$lib/stores/websocketStore'
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import { emitGetConnectedUsers } from '$lib/websocket'

	export let viewers: any = [],
		channel: any

	let cursor = 0

	channel_message.subscribe((value) => {
		if (!value) return
		var parsedMsg = JSON.parse(value)

		if (parsedMsg.eventName === `channel-paginated-users-${channel?._id}`) {
			viewers.push(...parsedMsg.users)
		}
	})

	async function loadMore(): Promise<void> {
		emitGetConnectedUsers({ channelSocket: channel.socket, cursor })
		cursor += 100
	}
</script>

<ul
	tabindex="-1"
	class="dropdown-content p-2 shadow bg-base-200 rounded-box m-3 flex flex-col h-96 overflow-y-scroll">
	{#each viewers as user}
		<Viewer {user} />
	{/each}
	<li use:LastItemInViewport on:loadMore={loadMore} />
</ul>

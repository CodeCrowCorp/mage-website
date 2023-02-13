<script lang="ts">
	import ChatProfileCard from '$lib/components/Channel/Chat/ChatProfileCard.svelte'
	export let sender: any, channelSocket: WebSocket
	let coloredRoles: { tagColor?: any; textColor?: string }

	switch (sender.role) {
		case 'Host':
			coloredRoles = {
				tagColor: 'bg-secondary',
				textColor: 'text-pink-500'
			}
			break
		case 'You':
			coloredRoles = {
				tagColor: 'bg-gray-600'
			}
			break
		case 'Mod':
			coloredRoles = {
				tagColor: 'bg-green-700',
				textColor: 'text-success'
			}
			break
		case 'Rando':
			coloredRoles = {
				textColor: 'text-info'
			}
			break
	}

	function emitReactToMessage({
		channelId,
		message,
		user,
		reaction
	}: {
		channelId: string
		message: any
		user: any
		reaction: string
	}) {
		channelSocket?.send(
			JSON.stringify({
				eventName: `react-to-message`,
				channel: channelId,
				message,
				user,
				reaction
			})
		)
	}

	function emitChannelSubscribeByUser({
		channelId,
		userId
	}: {
		channelId: string
		userId: string
	}) {
		channelSocket?.send(
			JSON.stringify({
				eventName: `channel-subscribe`,
				channel: channelId,
				userId: userId
			})
		)
	}

	function emitDeleteMessageToChannel({
		channelId,
		message
	}: {
		channelId: string
		message: string
	}) {
		channelSocket?.send(
			JSON.stringify({
				eventName: `delete-channel-message`,
				channel: channelId,
				message
			})
		)
	}
</script>

<!-- <ChatProfileCard /> -->

<div class="menu">
	<ul>
		<li>
			{#if sender.role === 'You'}
				<!--You-->
				<div class="p-1 border border-transparent rounded-lg flex flex-row-reverse gap-2 w-96">
					<span>
						<span>{sender.message}</span>
						<span class="font-medium">@{sender.username}</span>
						<span class="{coloredRoles.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
							>{sender.role}</span>
					</span>
				</div>
			{:else}
				<!--Host, Mod, or Rando-->
				<div class="p-1 border border-transparent rounded-lg flex gap-2 w-96">
					<span>
						{#if sender.role == 'Host' || sender.role == 'Mod'}
							<span class="{coloredRoles.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
								>{sender.role}</span>
						{/if}
						<span
							data-popover-target="popover-user-profile"
							class="{coloredRoles.textColor} font-medium">@{sender.username}</span>
						<span>{sender.message}</span>
					</span>
				</div>
			{/if}
		</li>
	</ul>
</div>

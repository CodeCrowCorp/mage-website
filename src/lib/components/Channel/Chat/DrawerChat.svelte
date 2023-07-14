<script lang="ts">
	import ChatInput from '$lib/components/Channel/Chat/ChatInput.svelte'
	import Message from '$lib/components/Channel/Chat/Message.svelte'
	import { channel_connection, channel_message } from '$lib/stores/websocketStore'
	import DropdownViewChannel from '$lib/components/Channel/Chat/DropdownViewChannel.svelte'
	import { page } from '$app/stores'
	import { onDestroy, onMount } from 'svelte'
	import { is_chat_drawer_open, was_chat_drawer_closed } from '$lib/stores/channelStore'
	import { emitChatHistoryToChannel } from '$lib/websocket'
	import { setRole } from '$lib/utils'
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import ProfilePopup from './ProfilePopup.svelte'

	export let channel: any = undefined,
		showEditChannelDrawer: boolean = false,
		viewers: any[] = [],
		chatHistory: any[] = []

	let cursor: any = undefined
	let profileElt: any = null
	let selectedUser: string = ''
	let ignoreOutsideClick = false

	channel_message.subscribe((value) => {
		if (!value) return
		var parsedMsg = JSON.parse(value)
		if (parsedMsg.eventName === `channel-message-${channel?._id}`) {
			if (parsedMsg.isMessageHistory) {
				cursor = parsedMsg.cursor
				let messages = parsedMsg.data.map((message: any) => {
					message.role = setRole({
						userId: message.user.userId,
						channel,
						currentUserId: $page.data.user?.userId
					})
					return message
				})
				chatHistory = [...chatHistory, ...messages]
			} else if (parsedMsg.isMessageDeleted) {
				chatHistory = chatHistory.filter((item) => item.timestamp !== parsedMsg.data.timestamp)
			} else {
				parsedMsg.role = setRole({
					userId: parsedMsg.user.userId,
					channel,
					currentUserId: $page.data.user?.userId
				})
				chatHistory.unshift(parsedMsg)
			}
			chatHistory = chatHistory
		}
	})

	onMount(() => {
		if (
			$was_chat_drawer_closed &&
			!chatHistory?.length &&
			$channel_connection === `open-${channel._id}` &&
			channel.socket?.readyState === WebSocket.OPEN
		) {
			emitChatHistoryToChannel({ channelSocket: channel.socket, channelId: channel._id, skip: 100 })
		}
	})

	onDestroy(() => {
		$is_chat_drawer_open = false
	})

	const loadMore = () => {
		if (
			$channel_connection === `open-${channel._id}` &&
			channel.socket?.readyState === WebSocket.OPEN
		) {
			emitChatHistoryToChannel({
				channelSocket: channel.socket,
				channelId: channel._id,
				skip: 100,
				cursor: cursor || 'none'
			})
		}
	}

	const closeProfile = () => {
		if (ignoreOutsideClick) return
		profileElt = null
		selectedUser = ''
	}

	const onUsernameClick = (evt: any) => {
		profileElt = evt.target
		selectedUser = profileElt.id.substr(1)
		ignoreOutsideClick = true
		setTimeout(() => {
			ignoreOutsideClick = false
		}, 100)
	}

</script>

<div class="bg-base-100 flex flex-col overflow-y-hidden w-72 md:w-full h-full rounded-lg">
	<DropdownViewChannel bind:channel bind:showEditChannelDrawer />
	<div on:scroll={closeProfile} class="flex flex-col-reverse p-3 grow overflow-y-scroll w-96">
		<ProfilePopup
			open={profileElt ? true : false}
			elt={profileElt}
			bind:userId={selectedUser}
			onOutsideClick={closeProfile} />
		{#each chatHistory as sender}
			<Message bind:sender bind:hostId={channel.user} bind:channel {onUsernameClick} />
		{/each}
		<span use:LastItemInViewport on:loadMore={loadMore} />
	</div>
	<div class="flex flex-row mt-auto p-3 w-full">
		<ChatInput bind:channel bind:viewers />
	</div>
</div>

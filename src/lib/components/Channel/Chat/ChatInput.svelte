<script lang="ts">
	import IconChatAI from '$lib/assets/icons/chat/IconChatAI.svelte'
	import IconChatGif from '$lib/assets/icons/chat/IconChatGif.svelte'
	import IconChatCode from '$lib/assets/icons/chat/IconChatCode.svelte'
	import IconChatSendMessage from '$lib/assets/icons/chat/IconChatSendMessage.svelte'
	import { emitChannelUpdate, emitMessageToChannel } from '$lib/websocket'
	import { page } from '$app/stores'
	import { channel_connection } from '$lib/stores/websocketStore'
	import EmojiPicker from '$lib/components/Channel/Chat/EmojiPicker.svelte'

	export let channel: any
	export let users: any
	let selectedCommand = 0
	let selectedUser = 0

	$: chatMessage = ''
	$: isChannelSocketConnected =
		$channel_connection === `open-${channel._id}` && $page.data.user?.userId
	$: isHost = channel.user === $page.data.user?.userId

	const sendMessage = () => {
		if (messageIsCommand) {
			if (selectedCommand && selectedUser >= 0) {
				const user = users[selectedUser]
				executeCommand(selectedCommand, user.userId)
			}
		} else if (!chatMessage.startsWith('/')) {
			if (chatMessage === null || chatMessage.match(/^\s*$/) !== null) return
			const completeMessage = {
				isAiChatEnabled: channel.isAiChatEnabled,
				body: chatMessage,
				state: { timestamp: Date.now() },
				user: {
					userId: $page.data.user?.userId || '',
					username: $page.data.user?.user?.username || ''
				}
			}
			emitMessageToChannel({
				channelSocket: channel.socket,
				channelId: channel._id,
				message: JSON.stringify(completeMessage)
			})
		}
		chatMessage = ''
	}

	const toggleAIChat = async () => {
		channel.isAiChatEnabled = !channel.isAiChatEnabled
		emitChannelUpdate({ channelSocket: channel.socket, channel })
	}

	const slectCommandfromKey = (key: string) => {
		if (key === 'ArrowDown' && selectedCommand < 3) {
			selectedCommand++
		} else if (key === 'ArrowUp' && selectedCommand >= 1) {
			selectedCommand--
		}
	}

	const slectUserfromKey = (key: string) => {
		if (key === 'ArrowDown' && selectedUser < users.length) {
			selectedUser++
		} else if (key === 'ArrowUp' && selectedUser >= 0) {
			selectedUser--
		}
	}

	const getCommand = (id: number) => {
		return specialCommands.find((i) => i.id === id)?.cmd || ''
	}

	const executeCommand = (id: number, userId: string) => {
		specialCommands.find((i) => i.id === id)?.action(userId)
		selectedCommand = 0
		selectedUser = 0
	}

	const onEmojiSelect = (emoji: any) => {
		chatMessage = chatMessage.concat(emoji)
	}

	// toggle commands handlers

	const toggleBan = (userId: string) => {
		let isEnabled = false
		if (!channel.bans.includes(userId)) {
			channel.bans.push(userId)
			channel.guests = channel.guests.filter((guest: string) => guest !== userId)
			channel.mods = channel.mods.filter((mod: string) => mod !== userId)
			isEnabled = true
		} else {
			channel.bans = channel.bans.filter((ban: string) => ban !== userId)
		}
		emitChannelUpdate({
			channelSocket: channel.socket,
			channel,
			roleUpdate: { roleEvent: 'ban', isEnabled, userId: userId }
		})
	}

	const toggleMod = (userId: string) => {
		if (!channel.bans.includes(userId)) {
			let isEnabled = false
			if (!channel.mods?.includes(userId)) {
				channel.mods.push(userId)
				isEnabled = true
			} else {
				channel.mods = channel.mods.filter((mod: string) => mod !== userId)
			}
			emitChannelUpdate({
				channelSocket: channel.socket,
				channel,
				roleUpdate: { roleEvent: 'mod', isEnabled, userId: userId }
			})
		}
	}

	const toggleGuest = (userId: string) => {
		if (!channel.bans.includes(userId)) {
			let isEnabled = false
			if (!channel.guests.includes(userId) && channel.guests.length < 9) {
				channel.guests.push(userId)
				isEnabled = true
			} else {
				channel.guests = channel.guests.filter((guest: string) => guest !== userId)
			}
			emitChannelUpdate({
				channelSocket: channel.socket,
				channel,
				roleUpdate: { roleEvent: 'guest', isEnabled, userId: userId }
			})
		}
	}

	const specialCommands = [
		{
			id: 1,
			label: 'Toggle mod status',
			cmd: '/mod @',
			action: toggleMod
		},
		{
			id: 2,
			label: 'Toggle guest status',
			cmd: '/guest @',
			action: toggleGuest
		},
		{
			id: 3,
			label: 'Ban user',
			cmd: '/ban @',
			action: toggleBan
		}
	]

	$: messageIsCommand =
		chatMessage && chatMessage.startsWith('/') && /[a-z] @[a-z]/.test(chatMessage.substr(1))

	$: showUsers = chatMessage && chatMessage.endsWith('@')
	$: showCommandOptions =
		chatMessage &&
		chatMessage.startsWith('/') &&
		(channel.user === $page.data.user?.userId || channel.mods?.includes($page.data.user?.userId)) &&
		!showUsers &&
		!messageIsCommand
</script>

<form class="rounded-lg bg-base-200 p-2 w-full relative">
	<button
		class="btn text-white border-none tooltip font-normal normal-case {!isHost
			? 'no-animation'
			: ''} {channel.isAiChatEnabled ? 'btn-primary' : 'btn-neutral'}"
		data-tip="AI"
		on:click={() => {
			if (isHost) toggleAIChat()
		}}>
		<IconChatAI />
		<span class="sr-only">Enable AI</span>
	</button>
	<EmojiPicker onSelect={onEmojiSelect} />
	<button
		disabled
		type="button"
		class="btn btn-neutral text-white border-none tooltip font-normal normal-case"
		data-tip="GIF">
		<IconChatGif />
		<span class="sr-only">Add GIF</span>
	</button>
	<button
		disabled
		type="button"
		class="btn btn-neutral text-white border-none tooltip font-normal normal-case"
		data-tip="Code snippet">
		<IconChatCode />
		<span class="sr-only">Add code snippet</span>
	</button>

	<div class="absolute w-full -mt-4">
		{#if showCommandOptions && !showUsers}
			<div
				class={'dropdown dropdown-top w-full rounded-box bg-white ' +
					(showCommandOptions ? 'dropdown-open' : '')}>
				<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
					{#each specialCommands as command}
						<li
							on:click={() => {
								selectedCommand = command.id
								chatMessage = command.cmd
							}}>
							<span
								class={'text-sm w-full' +
									(selectedCommand == command.id ? ' bg-gray-600 text-white' : '')}>
								{command.label}
								<kbd class="kbd text-xs font-semibold text-green-500 ml-auto">
									{command.cmd}
								</kbd>
							</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if users.length > 0 && showUsers}
			<div
				class={'dropdown dropdown-top w-full rounded-box bg-white ' +
					(showUsers ? 'dropdown-open' : '')}>
				<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
					{#each users as user, idx}
						<li
							on:click={() => {
								chatMessage = chatMessage.replace(/@/g, '@' + user.username) + ' '
								selectedUser = idx
							}}>
							<span class={'text-sm w-full' + (selectedUser == idx ? ' bg-gray-600' : '')}>
								@{user.username}
							</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>

	<div class="flex items-center py-2 rounded-lg">
		{#if !isChannelSocketConnected || channel.bans?.includes($page.data.user.userId)}
			<input
				class="animate-pulse block mx-1 p-2.5 w-full text-sm textarea textarea-bordered textarea-secondary"
				placeholder="Disabled"
				disabled />
		{:else}
			<textarea
				on:keydown={(e) => {
					if (showCommandOptions || showUsers) {
						if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
							e.preventDefault()
							if (showUsers) slectUserfromKey(e.key)
							else slectCommandfromKey(e.key)
						} else if (e.key === 'Enter') {
							e.preventDefault()
							if (showUsers) {
								if (selectedUser >= 0) {
									const user = users[selectedUser]
									chatMessage = chatMessage.replace(/@/, '@' + user.username) + ' '
								}
							} else {
								if (selectedCommand) {
									chatMessage = getCommand(selectedCommand)
								}
							}
						}
					} else if (e.key === 'Enter') {
						e.preventDefault()
						sendMessage()
					}
				}}
				bind:value={chatMessage}
				rows="1"
				class="block mx-1 p-2.5 w-full text-sm textarea textarea-bordered textarea-secondary"
				placeholder="Your message..." />
			<button
				on:click={() => {
					sendMessage()
				}}
				class="btn btn-ghost btn-circle text-secondary">
				<IconChatSendMessage />
				<span class="sr-only">Send message</span>
			</button>
		{/if}
	</div>
</form>

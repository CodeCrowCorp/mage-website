<script lang="ts">
	// import IconChatAttachment from '$lib/assets/icons/chat/IconChatAttachment.svelte'
	import IconChatAI from '$lib/assets/icons/chat/IconChatAI.svelte'
	import IconChatEmoji from '$lib/assets/icons/chat/IconChatEmoji.svelte'
	import IconChatGif from '$lib/assets/icons/chat/IconChatGif.svelte'
	import IconChatCode from '$lib/assets/icons/chat/IconChatCode.svelte'
	import IconChatSendMessage from '$lib/assets/icons/chat/IconChatSendMessage.svelte'
	import { emitChannelUpdate, emitMessageToChannel } from '$lib/websocket'
	import { page } from '$app/stores'
	import { channel_connection } from '$lib/stores/websocketStore'

	export let channel: any
	export let users:any[] = []
	let selectedCommand = 0
	let selectedUser = 0

	$: chatMessage = ''
	$: isChannelSocketConnected =
		$channel_connection === `open-${channel._id}` && $page.data.user?.userId
	$: isHost = channel.user === $page.data.user?.userId

	const sendMessage = () => {
		if (chatMessage === null || chatMessage.match(/^\s*$/) !== null) return
		const completeMessage = {
			isAiChatEnabled: channel.isAiChatEnabled,
			body: chatMessage,
			state: { timestamp: new Date().toISOString() },
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
		return specialCommands.find(i => i.id === id)?.cmd || ""
	}

	const executeCommand = (id: number, userId: string) => {
		specialCommands.find(i => i.id === id)?.action(userId)
	}


	// toggle commands handlers

	const toggleBan = (userId: string) => {
		if (channel.bans.includes(userId)) {
			channel.bans = channel.bans.filter((ban: string) => ban !== userId)
		} else {
			channel.bans.push(userId)
			channel.guests = channel.guests.filter((guest: string) => guest !== userId)
			channel.mods = channel.mods?.filter((mod: string) => mod !== userId)
		}
		alert("toggleBan")
		//emitChannelUpdate({ channelSocket: channel.socket, channel })
	}

	const toggleMod = (userId: string) => {
		if (channel.mods?.includes(userId)) {
			channel.mods = channel.mods?.filter((mod: string) => mod !== userId)
		} else {
			channel.mods?.push(userId)
		}
		alert("toggleMod")
		//emitChannelUpdate({ channelSocket: channel.socket, channel })
	}

	const toggleGuest = (userId: string) => {
		if (!channel.guests.includes(userId) && channel.guests.length < 9) {
			channel.guests.push(userId)
		} else {
			channel.guests = channel.guests.filter((guest: string) => guest !== $page.data.user?.userId)
		}
		alert("toggleGuest")
		//emitChannelUpdate({ channelSocket: channel.socket, channel })
	}

	const specialCommands = [
		{
			id: 1,
			label: 'Toggle mod status',
			cmd: '/mod @username',
			action: toggleBan
		},
		{
			id: 2,
			label: 'Toggle guest status',
			cmd: '/guest @username',
			action: toggleMod
		},
		{
			id: 3,
			label: 'Ban user',
			cmd: '/ban @username',
			action: toggleGuest
		}
	]

	
	$: showUsers = chatMessage && chatMessage.startsWith('/') && chatMessage.includes('@username')
	$: showCommandOptions =
		chatMessage &&
		chatMessage.startsWith('/') &&
		(channel.user === $page.data.user?.userId || channel.mods?.includes($page.data.user?.userId)) &&
		!showUsers


</script>

<form class="rounded-lg bg-base-200 p-2 w-full">
	<button
		class="btn tooltip font-normal normal-case {!isHost
			? 'no-animation'
			: ''} {channel.isAiChatEnabled ? 'btn-primary' : ''}"
		data-tip="AI"
		on:click={() => {
			if (isHost) toggleAIChat()
		}}>
		<IconChatAI />
		<span class="sr-only">Enable AI</span>
	</button>
	<button disabled type="button" class="btn tooltip font-normal normal-case" data-tip="Emoji">
		<IconChatEmoji />
		<span class="sr-only">Add emoji</span>
	</button>
	<button disabled type="button" class="btn tooltip font-normal normal-case" data-tip="GIF">
		<IconChatGif />
		<span class="sr-only">Add GIF</span>
	</button>
	<button
		disabled
		type="button"
		class="btn tooltip font-normal normal-case"
		data-tip="Code snippet">
		<IconChatCode />
		<span class="sr-only">Add code snippet</span>
	</button>

	<!-- Special commands drop-up -->
	<div
		class={'dropdown dropdown-top w-full rounded-box bg-white ' +
			(showCommandOptions ? 'dropdown-open' : '')}>
		<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
			{#each specialCommands as command}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={() =>{
						selectedCommand = command.id
					 	chatMessage = command.cmd
					 }} >
					<span class={'text-sm w-full' + (selectedCommand == command.id ? ' bg-gray-600' : '')}>
						{command.label}
						<kbd class="kbd text-xs ml-2 font-semibold text-green-500">
							{command.cmd}
						</kbd>
					</span>
				</li>
			{/each}
		</ul>
	</div>

	<div
		class={'dropdown dropdown-top w-full rounded-box bg-white ' +
			(showUsers ? 'dropdown-open' : '')}>
		<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
			{#each users as user, idx}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={() =>{
					 chatMessage = chatMessage.replace(/username/g, user.username)
					 selectedUser = idx
					 selectedCommand = 0
					}} >
					<span class={'text-sm w-full' + (selectedUser == idx ? ' bg-gray-600' : '')}>
						@{user.username}
					</span>
				</li>
			{/each}
		</ul>
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
							if(showUsers)slectUserfromKey(e.key)
							else slectCommandfromKey(e.key)
						} else if (e.key === 'Enter') {
							e.preventDefault()
							if(showUsers){
								if(selectedUser >= 0){
									const user = users[selectedUser]
									chatMessage = chatMessage.replace(/username/, user.username)
									executeCommand(selectedCommand, user.userId)
									chatMessage = ""
									selectedCommand = 0
								}
							}
							else {
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
				placeholder="Your message..." /><!--focus:h-32 -->
			<button
				on:click={() => {
					if(showCommandOptions || showUsers){
						if(selectedCommand && selectedUser >= 0){
							const user = users[selectedUser]
							executeCommand(selectedCommand, user.userId)
						}
					}
					else {
						sendMessage()
					}
				}}
				class="inline-flex justify-center p-2 text-secondary rounded-full cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
				<IconChatSendMessage />
				<span class="sr-only">Send message</span>
			</button>
		{/if}
	</div>
</form>

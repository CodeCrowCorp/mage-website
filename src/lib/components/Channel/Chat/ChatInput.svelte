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
	let selectedCommand = 0

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

	const slectCommandfromKey = (key:string) => {
		if(key === "ArrowDown" && selectedCommand < 3){
			selectedCommand++			
		}
		else if(key === "ArrowUp" && selectedCommand >= 1){
			selectedCommand--
		}
	}

	$: showCommandOptions = chatMessage && chatMessage.startsWith("/")

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
	<!-- Command drop-up -->
	<div class={"dropdown dropdown-top w-full rounded-box bg-white " + (showCommandOptions ? "dropdown-open" : "")}>
		<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
			<li class={selectedCommand == 1 ? " bg-gray-600" : ""}>
				<span class="text-sm w-full">
					Toggle mod status
					<kbd class="kbd text-xs ml-2 font-semibold text-green-500">
						/mod @username
					</kbd>
				</span>
			</li>
			<li class={selectedCommand == 2 ? " bg-gray-600" : ""}>
				<span class="text-sm w-full">
					Toggle guest status 
					<kbd class="kbd text-xs ml-2 font-semibold text-green-500">
						/guest @username
					</kbd>
				</span>
			</li>
			<li class={selectedCommand == 3 ? " bg-gray-600" : ""}>
				<span class="text-sm w-full">
					Ban user
					<kbd class="kbd text-xs ml-2 font-semibold text-green-500">
						/ban @username
					</kbd>
				</span>
			</li>
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
				
					if(showCommandOptions){
						if(e.key === "ArrowDown" || e.key === "ArrowUp"){
							e.preventDefault()
							slectCommandfromKey(e.key)
						}
						else if(e.key === 'Enter' && selectedCommand){
							e.preventDefault()
							// execute selected command
						}
					}
					else if(e.key === 'Enter'){
						e.preventDefault()
						sendMessage()
					}
														
				}}
				bind:value={chatMessage}
				rows="1"
				class="block mx-1 p-2.5 w-full text-sm textarea textarea-bordered textarea-secondary"
				placeholder="Your message..." 
			/><!--focus:h-32 -->
			<button
				on:click={() => !showCommandOptions && sendMessage()}
				class="inline-flex justify-center p-2 text-secondary rounded-full cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
				<IconChatSendMessage />
				<span class="sr-only">Send message</span>
			</button>
		{/if}
	</div>
</form>


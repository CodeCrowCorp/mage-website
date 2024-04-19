<script lang="ts">
	import IconChatMod from '$lib/assets/icons/chat/IconChatMod.svelte'
	import IconChatGuest from '$lib/assets/icons/chat/IconChatGuest.svelte'
	import IconChatReact from '$lib/assets/icons/chat/IconChatReact.svelte'
	import IconChatQuote from '$lib/assets/icons/chat/IconChatQuote.svelte'
	import IconChatDelete from '$lib/assets/icons/chat/IconChatDelete.svelte'
	import IconChatHorizontalMore from '$lib/assets/icons/chat/IconChatHorizontalMore.svelte'
	import { emitChannelUpdate, emitDeleteMessageToChannel } from '$lib/websocket'
	import { getColoredRole, setRole } from '$lib/utils'
	import { page } from '$app/stores'
	import IconChatBan from '$lib/assets/icons/chat/IconChatBan.svelte'
	import { onMount } from 'svelte'
	import IconSocialYouTube from '$lib/assets/icons/social/IconSocialYouTube.svelte'
	import IconSocialTwitch from '$lib/assets/icons/social/IconSocialTwitch.svelte'

	export let sender: any, hostId: string, channel: any, onUsernameClick: any
	let role: string, coloredRole: any

	$: isGuest = channel?.guests?.includes(sender.user?.userId)

	$: showBanItem =
		(hostId === $page.data.user?.userId || channel?.mods?.includes($page.data.user?.userId)) &&
		sender.user?.userId !== $page.data.user?.userId &&
		role !== '🤖 AI'

	$: showRoleItem =
		hostId === $page.data.user?.userId &&
		sender.user?.userId !== $page.data.user?.userId &&
		role !== '🤖 AI'

	$: if (channel) {
		role = setRole({ userId: sender.user?.userId, channel, currentUserId: $page.data.user?.userId })
		coloredRole = getColoredRole(role)
	}

	const deleteMessage = () => {
		var channelId = sender.eventName.split('-').pop()
		var updatedSender: any = { ...sender }
		delete updatedSender.user
		delete updatedSender.role
		emitDeleteMessageToChannel({
			channelSocket: channel.socket,
			channelId,
			message: JSON.stringify(updatedSender)
		})
	}

	const toggleBan = () => {
		let isEnabled = false
		if (!channel.bans.includes(sender.user?.userId)) {
			channel.bans.push(sender.user?.userId)
			channel.guests = channel.guests.filter((guest: string) => guest !== sender.user?.userId)
			channel.mods = channel.mods.filter((mod: string) => mod !== sender.user?.userId)
			isGuest = false
			isEnabled = true
		} else {
			channel.bans = channel.bans.filter((ban: string) => ban !== sender.user?.userId)
		}
		emitChannelUpdate({
			channelSocket: channel.socket,
			channel,
			roleUpdate: { roleEvent: 'ban', isEnabled, userId: sender.user?.userId }
		})
	}

	const toggleMod = () => {
		let isEnabled = false
		if (!channel.mods?.includes(sender.user?.userId)) {
			channel.mods?.push(sender.user?.userId)
			isEnabled = true
		} else {
			channel.mods = channel.mods?.filter((mod: string) => mod !== sender.user?.userId)
		}
		emitChannelUpdate({
			channelSocket: channel.socket,
			channel,
			roleUpdate: { roleEvent: 'mod', isEnabled, userId: sender.user?.userId }
		})
	}

	const toggleGuest = () => {
		let isEnabled = false
		if (!channel.guests.includes(sender.user?.userId) && channel.guests.length < 9) {
			channel.guests.push(sender.user?.userId)
			isEnabled = true
		} else {
			channel.guests = channel.guests.filter((guest: string) => guest !== sender.user?.userId)
		}
		emitChannelUpdate({
			channelSocket: channel.socket,
			channel,
			roleUpdate: { roleEvent: 'guest', isEnabled, userId: sender.user?.userId }
		})
	}

	const isImage = (message: string = '') => {
		// if message is a url and url is of an image
		const str = message.split('?')[0] || ''

		return (
			/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(message) &&
			/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(str)
		)
	}

	const isCodeSnippet = (message: string = '') => {
		if (message.includes('`')) {
			return true
		}
	}

	const getCodeSnippet = (message: string = '') => {
		if (message.includes('`')) {
			const s = message.indexOf('`')
			const e = message.lastIndexOf('`')

			let code = message.substring(s, e)
			let splitted = message.split(code)
			let resp: any = {}
			resp.startText = splitted[0]
			resp.code = code
				.substr(1)
				.split('\n')
				.map((i) => i)
			resp.endText = splitted.pop()?.substr(1) || ''

			return resp
		}
	}

	const hightlightUsername = (match: string) => {
		return `
			<span 
				class="text-success font-medium cursor-pointer link"
				name="username"
				id=${match}
			>
				${match}
			</span>
		`
	}

	const parse = (msg: string) => {
		const m = msg + ' '
		return m.replace(/@[\w-]+[,\s]/g, hightlightUsername).trim()
	}

	onMount(() => {
		const spans = document.querySelectorAll('span[name="username"]')
		spans.forEach((span: any) => {
			span.onclick = onUsernameClick
		})
	})

	$: codeSnippet = isCodeSnippet(sender.message) ? getCodeSnippet(sender.message) : false
</script>

<div class="menu hover:bg-base-300 rounded-md group">
	<div class="relative m-1">
		<!--Host, Mod, You or Rando-->
		<div class="border border-transparent rounded-lg gap-2 flex">
			{#if !sender.platform}
				<div
					class="group-hover:block dropdown-menu absolute hidden right-0 dropdown dropdown-left dropdown-end"
					tabindex="1">
					<div class="rounded-lg bg-base-300 absolute bottom-0 right-0 border-base-100 border-2">
						<IconChatHorizontalMore />
					</div>
					<ul
						tabindex="1"
						class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 z-10">
						<li class="disabled"><a><IconChatReact /> React </a></li>
						<li class="disabled"><a><IconChatQuote /> Quote </a></li>
						{#if showRoleItem && !channel.bans.includes(sender.user?.userId)}
							<li>
								<a on:click={() => toggleMod()}
									><IconChatMod /> {role === 'Mod' ? 'Revoke Mod' : 'Grant Mod'}
								</a>
							</li>
							<li>
								<a on:click={() => toggleGuest()}
									><IconChatGuest /> {isGuest ? 'Revoke Guest' : 'Grant Guest'}
								</a>
							</li>
						{/if}
						{#if showBanItem}
							<li>
								<a on:click={() => toggleBan()}
									><IconChatBan /> {channel.bans?.includes(sender.user?.userId) ? 'Unban' : 'Ban'}
								</a>
							</li>
						{/if}
						{#if hostId === $page.data.user?.userId || sender.user?.userId === $page.data.user?.userId}
							<li>
								<a on:click={() => deleteMessage()}><IconChatDelete /> Delete</a>
							</li>
						{/if}
					</ul>
				</div>
			{/if}
			<div class="d-flex align-items-center">
				{#if sender.platform === 'twitch'}
					<IconSocialTwitch />
				{/if}
				{#if sender.platform === 'youtube'}
					<div style="display: ruby;"><IconSocialYouTube /></div>
				{/if}
				{#if role === '🤖 AI' || role === 'Host' || role === 'Mod' || role === 'You'}
					<span class="{coloredRole.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
						>{role}</span>
				{/if}
				{#if role !== '🤖 AI'}
					<span
						class="{coloredRole.textColor} font-medium cursor-pointer"
						on:click={onUsernameClick}
						id={'@' + sender.user?.username}>
						@{sender.user?.username}
					</span>
				{/if}
				{#if isImage(sender.message)}
					<img class="py-2 pr-2" src={sender.message} alt="imgs" />
				{:else if codeSnippet}
					{#if codeSnippet.startText}
						<span class="break-all">{codeSnippet.startText}</span>
					{/if}
					{#if codeSnippet.code}
						<div class="mockup-code my-2">
							{#each codeSnippet.code as line, idx}
								<pre data-prefix={idx + 1}><code>{line}</code></pre>
							{/each}
						</div>
					{/if}
					{#if codeSnippet.endText}
						<span class="break-all">{codeSnippet.endText}</span>
					{/if}
				{:else}
					<span style="overflow-wrap: anywhere">{@html parse(sender.message)}</span>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	a.disabled {
		pointer-events: none;
		color: #ccc;
	}
</style>

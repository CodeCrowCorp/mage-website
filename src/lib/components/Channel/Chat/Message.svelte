<script lang="ts">
	import IconChatMod from '$lib/assets/icons/chat/IconChatMod.svelte'
	import IconChatGuest from '$lib/assets/icons/chat/IconChatGuest.svelte'
	import IconChatReact from '$lib/assets/icons/chat/IconChatReact.svelte'
	import IconChatQuote from '$lib/assets/icons/chat/IconChatQuote.svelte'
	import IconChatDelete from '$lib/assets/icons/chat/IconChatDelete.svelte'
	import IconChatHorizontalMore from '$lib/assets/icons/chat/IconChatHorizontalMore.svelte'
	import ProfileCard from '$lib/components/Channel/Chat/ProfileCard.svelte'
	import { emitChannelUpdate, emitDeleteMessageToChannel } from '$lib/websocket'
	import { getColoredRole, setRole } from '$lib/utils'
	import { page } from '$app/stores'
	import IconChatBan from '$lib/assets/icons/chat/IconChatBan.svelte'

	export let sender: any, hostId: string, channel: any, role: string, coloredRole: any

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
</script>

<ul class="menu">
	<li class="group relative dropdown">
		<!--Host, Mod, You or Rando-->
		<div class="p-1 border border-transparent rounded-lg flex gap-2 overflow-x-hidden">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>
				{#if role === '🤖 AI' || role === 'Host' || role === 'Mod' || role === 'You'}
					<span class="{coloredRole.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
						>{role}</span>
				{/if}
				{#if role !== '🤖 AI'}
					<span
						data-popover-target="popover-user-profile"
						class="{coloredRole.textColor} font-medium">@{sender.user?.username}</span>
				{/if}
				<span class="break-all">{sender.message}</span>
			</label>
			<!-- <ul class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
				<ProfileCard userId={sender.user?.userId} />
			</ul> -->
			<div
				class="group-hover:block dropdown-menu absolute hidden right-0 dropdown dropdown-left dropdown-end"
				tabindex="1">
				<div class="rounded-lg bg-base-200 m-1 border-base-100 border-2">
					<IconChatHorizontalMore />
				</div>
				<ul tabindex="1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
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
		</div>
	</li>
</ul>

<style>
	a.disabled {
		pointer-events: none;
		color: #ccc;
	}
</style>

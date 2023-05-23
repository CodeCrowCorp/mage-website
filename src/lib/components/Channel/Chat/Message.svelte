<script lang="ts">
	import IconChatMod from '$lib/assets/icons/chat/IconChatMod.svelte'
	import IconChatGuest from '$lib/assets/icons/chat/IconChatGuest.svelte'
	import IconChatReact from '$lib/assets/icons/chat/IconChatReact.svelte'
	import IconChatQuote from '$lib/assets/icons/chat/IconChatQuote.svelte'
	import IconChatDelete from '$lib/assets/icons/chat/IconChatDelete.svelte'
	import IconChatHorizontalMore from '$lib/assets/icons/chat/IconChatHorizontalMore.svelte'
	import ProfileCard from '$lib/components/Channel/Chat/ProfileCard.svelte'
	import { emitChannelUpdate, emitDeleteMessageToChannel } from '$lib/websocket'
	import { getColoredRole } from '$lib/utils'
	import { page } from '$app/stores'
	import IconChatBan from '$lib/assets/icons/chat/IconChatBan.svelte'

	export let sender: any, hostId: string, channel: any

	$: coloredRole = getColoredRole(sender.role)
	$: isGuest = channel?.guests?.includes(sender.user?.userId)

	const deleteMessage = () => {
		if (sender.user?.userId === hostId || sender.user?.userId === $page.data.user?.userId) {
			var channelId = sender.eventName.split('-').pop()
			var updatedSender: any = { ...sender }
			delete updatedSender.user
			delete updatedSender.role
			emitDeleteMessageToChannel({ channelId, message: JSON.stringify(updatedSender) })
		}
	}

	const toggleBan = () => {
		if (channel.bans.includes(sender.user?.userId)) {
			channel.bans = channel.bans.filter((ban: string) => ban !== sender.user?.userId)
		} else {
			channel.bans.push(sender.user?.userId)
			channel.guests = channel.guests.filter((guest: string) => guest !== sender.user?.userId)
			channel.mods = channel.mods.filter((mod: string) => mod !== sender.user?.userId)
			isGuest = false
		}
		emitChannelUpdate({ channel })
	}

	const toggleMod = () => {
		if (channel.mods.includes(sender.user?.userId)) {
			channel.mods = channel.mods.filter((mod: string) => mod !== sender.user?.userId)
		} else {
			channel.mods.push(sender.user?.userId)
		}
		emitChannelUpdate({ channel })
	}

	const toggleGuest = () => {
		if (!channel.guests.includes(sender.user?.userId) && channel.guests.length < 9) {
			channel.guests.push(sender.user?.userId)
		} else {
			channel.guests = channel.guests.filter((guest: string) => guest !== sender.user?.userId)
		}
		emitChannelUpdate({ channel })
	}
</script>

<!-- <ProfileCard /> -->

<ul class="menu">
	<li class="group relative dropdown">
		<!--Host, Mod, You or Rando-->
		<div class="p-1 border border-transparent rounded-lg flex gap-2 overflow-x-hidden">
			<span>
				{#if sender.role === '🤖 AI' || sender.role === 'Host' || sender.role === 'Mod' || sender.role === 'You'}
					<span class="{coloredRole.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
						>{sender.role}</span>
				{/if}
				{#if sender.role !== '🤖 AI'}
					<span
						data-popover-target="popover-user-profile"
						class="{coloredRole.textColor} font-medium">@{sender.user?.username}</span>
				{/if}
				<span class="break-all">{sender.message}</span>
			</span>
			<div
				class="group-hover:block dropdown-menu absolute hidden right-0 dropdown dropdown-left dropdown-end"
				tabindex="1">
				<div class="rounded-lg bg-base-200 m-1 border-base-100 border-2">
					<IconChatHorizontalMore />
				</div>
				<ul tabindex="1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
					<li class="disabled"><a><IconChatReact /> React </a></li>
					<li class="disabled"><a><IconChatQuote /> Quote </a></li>
					{#if sender.user?.userId === hostId && sender.user?.userId !== $page.data.user?.userId && channel?.mods?.includes($page.data.user?.userId)}
						<li>
							<a on:click={() => toggleBan()}
								><IconChatBan /> {channel.bans?.includes(sender.user?.userId) ? 'Unban' : 'Ban'}
							</a>
						</li>
					{/if}
					{#if sender.user?.userId === hostId && sender.user?.userId !== $page.data.user?.userId}
						<li>
							<a on:click={() => toggleMod()}
								><IconChatMod /> {sender.role === 'Mod' ? 'Remove Mod' : 'Grant Mod'}
							</a>
						</li>
						<li>
							<a on:click={() => toggleGuest()}
								><IconChatGuest /> {isGuest ? 'Revoke Guest' : 'Guest'}
							</a>
						</li>
					{/if}
					{#if sender.user?.userId === hostId || sender.user?.userId === $page.data.user?.userId}
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

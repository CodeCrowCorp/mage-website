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
	import { onMount } from 'svelte'

	export let sender: any, hostId: string, channel: any
	let coloredRole: any = {},
		isGuest = false

	onMount(() => {
		coloredRole = getColoredRole(sender.role)
		isGuest = channel?.guests?.includes(sender.userData?.userId)
	})

	const deleteMessage = () => {
		if (sender.userData?.userId === hostId || sender.userData?.userId === $page.data.user?.userId) {
			var channelId = sender.eventName.split('-').pop()
			var updatedSender: any = { ...sender }
			delete updatedSender.user
			delete updatedSender.role
			emitDeleteMessageToChannel({ channelId, message: JSON.stringify(updatedSender) })
		}
	}

	const toggleMod = () => {
		if (channel.mods.includes(sender.userData?.userId)) {
			channel.mods = channel.mods.filter((mod: string) => mod !== sender.userData?.userId)
		} else {
			channel.mods.push(sender.userData?.userId)
		}
		emitChannelUpdate({ channel })
	}

	const toggleGuest = () => {
		if (channel.guests.includes(sender.userData?.userId)) {
			channel.guests = channel.guests.filter((guest: string) => guest !== sender.userData?.userId)
		} else {
			channel.guests.push(sender.userData?.userId)
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
				{#if sender.role === 'Host' || sender.role === 'Mod' || sender.role === 'You'}
					<span class="{coloredRole?.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
						>{sender.role}</span>
				{/if}
				<span
					data-popover-target="popover-user-profile"
					class="{coloredRole?.textColor} font-medium">@{sender.userData?.username}</span>
				<span class="break-all">{sender.message}</span>
			</span>
			<div
				class="group-hover:block dropdown-menu absolute hidden right-0 dropdown dropdown-left dropdown-end"
				tabindex="1">
				<div class="rounded-lg bg-base-200 m-1 border-base-100 border-2">
					<IconChatHorizontalMore />
				</div>
				<ul tabindex="1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-fit">
					<li class="disabled"><a><IconChatReact /> React </a></li>
					<li class="disabled"><a><IconChatQuote /> Quote </a></li>
					{#if sender.userData?.userId === hostId}
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
					{#if sender.userData?.userId === hostId || sender.userData?.userId === $page.data.user?.userId}
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

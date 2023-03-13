<script lang="ts">
	import IconChatReact from '$lib/assets/icons/chat/IconChatReact.svelte'
	import IconChatQuote from '$lib/assets/icons/chat/IconChatQuote.svelte'
	import IconChatDelete from '$lib/assets/icons/chat/IconChatDelete.svelte'
	import IconChatHorizontalMore from '$lib/assets/icons/chat/IconChatHorizontalMore.svelte'
	import ProfileCard from '$lib/components/Channel/Chat/ProfileCard.svelte'
	import { emitDeleteMessageToChannel } from '$lib/websocket'
	import { getColoredRole } from '$lib/utils'
	import { page } from '$app/stores'

	export let sender: any, hostId: string
	let coloredRole = getColoredRole(sender.role)

	const deleteMessage = () => {
		if (sender.userData?.userId === hostId || sender.userData?.userId === $page.data.user?.userId) {
			var channelId = sender.eventName.split('-').pop()
			var updatedSender: any = { ...sender }
			delete updatedSender.user
			delete updatedSender.role
			emitDeleteMessageToChannel({ channelId, message: JSON.stringify(updatedSender) })
		}
	}
</script>

<!-- <ProfileCard /> -->

<ul class="menu">
	<li class="group relative dropdown">
		<!--Host, Mod, You or Rando-->
		<div class="p-1 border border-transparent rounded-lg flex gap-2 w-96 overflow-x-hidden">
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
					<li class="disabled"><a><IconChatReact /> React</a></li>
					<li class="disabled"><a><IconChatQuote /> Quote</a></li>
					<li
						class={sender.userData?.userId === hostId ||
						sender.userData?.userId === $page.data.user?.userId
							? ''
							: 'disabled'}>
						<a on:click={() => deleteMessage()}><IconChatDelete /> Delete</a>
					</li>
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

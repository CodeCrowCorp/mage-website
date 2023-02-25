<script lang="ts">
	import IconChatReact from '$lib/assets/icons/chat/IconChatReact.svelte'
	import IconChatQuote from '$lib/assets/icons/chat/IconChatQuote.svelte'
	import IconChatDelete from '$lib/assets/icons/chat/IconChatDelete.svelte'
	import IconChatHorizontalMore from '$lib/assets/icons/chat/IconChatHorizontalMore.svelte'
	import ProfileCard from '$lib/components/Channel/Chat/ProfileCard.svelte'
	import { emitDeleteMessageToChannel } from '$lib/websocket'

	export let sender: any
	let coloredRoles: { tagColor?: any; textColor?: string } = {}

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

	const deleteMessage = () => {
		var channelId = sender.eventName.split('-').pop()
		var updatedSender: any = { ...sender }
		delete updatedSender.user
		delete updatedSender.role
		emitDeleteMessageToChannel({ channelId, message: JSON.stringify(updatedSender) })
	}
</script>

<!-- <ProfileCard /> -->

<ul class="menu">
	<li class="group relative dropdown">
		{#if sender.role === 'You'}
			<!--You-->
			<div class="p-1 border border-transparent rounded-lg flex flex-row-reverse gap-2 w-96">
				<span>
					<span class="break-words">{sender.message}</span>
					<span class="font-medium">@{sender.userData?.username}</span>
					<span class="{coloredRoles?.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
						>{sender.role}</span>
				</span>
				<div
					class="group-hover:block dropdown-menu absolute hidden left-0 dropdown dropdown-right dropdown-end"
					tabindex="1">
					<div class="rounded-lg bg-base-200 m-1 border-base-100 border-2">
						<IconChatHorizontalMore />
					</div>
					<ul tabindex="1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-fit">
						<li class="disabled"><a><IconChatReact /> React</a></li>
						<li class="disabled"><a><IconChatQuote /> Quote</a></li>
						<li><a on:click={() => deleteMessage()}><IconChatDelete /> Delete</a></li>
					</ul>
				</div>
			</div>
		{:else}
			<!--Host, Mod, or Rando-->
			<div class="p-1 border border-transparent rounded-lg flex gap-2 w-96">
				<span>
					{#if sender.role === 'Host' || sender.role === 'Mod'}
						<span class="{coloredRoles?.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
							>{sender.role}</span>
					{/if}
					<span
						data-popover-target="popover-user-profile"
						class="{coloredRoles?.textColor} font-medium">@{sender.userData?.username}</span>
					<span class="break-words">{sender.message}</span>
					<div
						class="group-hover:block dropdown-menu absolute hidden right-0 dropdown dropdown-left dropdown-end"
						tabindex="1">
						<div class="rounded-lg bg-base-200 m-1 border-base-100 border-2">
							<IconChatHorizontalMore />
						</div>
						<ul tabindex="1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-fit">
							<li class="disabled"><a><IconChatReact /> React</a></li>
							<li class="disabled"><a><IconChatQuote /> Quote</a></li>
							<li><a on:click={() => deleteMessage()}><IconChatDelete /> Delete</a></li>
						</ul>
					</div>
				</span>
			</div>
		{/if}
	</li>
</ul>

<style>
	a.disabled {
		pointer-events: none;
		color: #ccc;
	}
</style>

<script lang="ts">
	import IconChatDelete from '$lib/assets/icons/chat/IconChatDelete.svelte'
	import IconChatHorizontalMore from '$lib/assets/icons/chat/IconChatHorizontalMore.svelte'
	import { getColoredRole } from '$lib/utils'
	import { onMount } from 'svelte'

	export let user: any

	const banUser = () => {
		console.log('ban user')
	}
</script>

<ul class="menu flex w-full">
	<li class="dropdown">
		<div class="p-1 border border-transparent rounded-lg flex gap-2">
			{#if user.role === 'Host' || user.role === 'Mod'}
				<span class="{user.coloredRole?.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
					>{user.role}</span>
			{/if}
			<span
				data-popover-target="popover-user-profile"
				class="{user.coloredRole?.textColor} font-medium">@{user.username}</span>
			<!-- <div class="menu dropdown dropdown-right dropdown-end">
				<label class="rounded-lg bg-base-200 m-1 border-base-100 border-2">
					<IconChatHorizontalMore />
				</label>
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-fit">
					<li><a on:click={async () => await banUser()}><IconChatDelete /> Ban </a></li>
				</ul>
			</div> -->
		</div>
	</li>
</ul>

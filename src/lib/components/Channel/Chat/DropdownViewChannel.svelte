<script lang="ts">
	import { get } from '$lib/api'
	import IconChatDownChevron from '$lib/assets/icons/chat/IconChatDownChevron.svelte'
	import { category_list } from '$lib/stores/channelStore'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { copyToClipboard } from '$lib/utils'
	import IconChatDelete from '$lib/assets/icons/chat/IconChatDelete.svelte'

	export let channel: any = undefined,
		showEditChannelDrawer: boolean = false

	let host: any = {},
		isHost: boolean = false

	onMount(async () => {
		host = await get(`users/search/id?userId=${channel?.user}`)
		isHost = channel?.user === $page.data.user.userId
	})
</script>

<div class="menu dropdown dropdown-bottom">
	<ul tabindex="-1">
		<li>
			<div class="p-3 text-xl mb-2 pb-2 border-purple-500 font-semibold border-b-2 flex">
				<p>{channel.title || 'Chat'}</p>
				<div
					class="absolute right-0 mx-3 mt-1 center tooltip tooltip-left"
					data-tip="View channel details">
					<IconChatDownChevron />
				</div>
			</div>
		</li>
	</ul>
	<ul tabindex="-1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-96 m-3">
		<li on:click={() => copyToClipboard(channel.description)} on:keyup>
			<a class="text-sm max-w-md">{channel.description || 'No description'}</a>
		</li>
		<li on:click={() => copyToClipboard(channel.category)} on:keyup>
			<a
				><div class="flex flex-wrap">
					{#if channel.category && channel.category.length}
						{#each channel.category as category}
							<div class="tooltip" data-tip={category}>
								<img src={$category_list[category]} alt="" class="w-7 m-1" />
							</div>
						{/each}
					{/if}
				</div></a>
		</li>
		<li on:click={() => copyToClipboard(channel.tags)} on:keyup>
			<a>
				<div class="flex flex-wrap gap-2">
					{#if channel.tags && channel.tags.length}
						{#each channel.tags as tag}
							<div>
								<span
									class="badge badge-md text-primary bg-gray-200 rounded-md font-semibold border-none"
									>{tag}</span>
							</div>
						{/each}
					{/if}
				</div>
			</a>
		</li>
		<li>
			<a href="/profile/{host?.username}">
				<div class="flex flex-wrap gap-2">
					<div class="avatar online">
						<div
							class="w-12 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2">
							<img src={host?.avatar} alt="" />
						</div>
					</div>
					<div>
						<div class="col-span-3 tooltip flex" data-tip={host?.displayName}>
							<p class="truncate">{host?.displayName}</p>
						</div>
						<div class="col-span-3 tooltip flex" data-tip="@{host?.username}">
							<p class=" text-pink-500 truncate">@{host?.username}</p>
						</div>
					</div>
				</div>
			</a>
		</li>
		{#if isHost}
			<div class="grid grid-cols-5 gap-2">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<label
					for="edit-channel-drawer"
					class="btn col-span-4 border-none font-normal normal-case tooltip tooltip-top flex"
					data-tip="Edit channel"
					on:click={() =>
						setTimeout(() => {
							showEditChannelDrawer = true
						}, 200)}>
					Edit channel
				</label>
				<label
					for="modal-delete-channel"
					class="btn col-span-1 bg-error text-white border-none font-normal normal-case tooltip tooltip-left tooltip-error flex"
					data-tip="Delete channel">
					<IconChatDelete />
				</label>
			</div>
		{/if}
	</ul>
</div>

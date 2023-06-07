<script lang="ts">
	import IconChatDownChevron from '$lib/assets/icons/chat/IconChatDownChevron.svelte'
	import { category_list } from '$lib/stores/channelStore'
	import { copyToClipboard } from '$lib/utils'
	import IconChatDelete from '$lib/assets/icons/chat/IconChatDelete.svelte'
	import IconChatStar from '$lib/assets/icons/chat/IconChatStar.svelte'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { del, get, put } from '$lib/api'

	export let channel: any = undefined,
		showEditChannelDrawer: boolean = false

	let host: any = {},
		isHost: boolean = false,
		isSubscribing: boolean = false,
		isFavorite: boolean = false

	$: if (channel) {
		getHostAndRelationship()
	}

	const getHostAndRelationship = async () => {
		host = await get(`users/search/id?userId=${channel.user}`)
		isHost = channel.user === $page?.data?.user?.userId
		if ($page.data.user?.userId) {
			const relationship = await get(`subscribes/relationship?source=${channel.user}`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
			isSubscribing = relationship?.isSubscribing
		}
	}

	onMount(async () => {
		if (!$page.data.user?.userId) return
		await getHostAndRelationship()
		isFavorite = $page.data.user?.user?.favChannelIds?.includes(channel._id)
	})

	const toggleSubscribe = async () => {
		isSubscribing = !isSubscribing
		if (isSubscribing) {
			await put(
				`subscribes`,
				{ source1: channel.user, source2: $page.data.user?.userId },
				{ userId: $page.data.user?.userId, token: $page.data.user?.token }
			)
		} else {
			await del(`subscribes?source1=${channel.user}&source2=${$page.data.user?.userId}`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
		}
	}

	const toggleFavorite = async () => {
		isFavorite = !isFavorite
		if (isFavorite) {
			await put(
				`users/channel?channelId=${channel._id}`,
				{},
				{ userId: $page.data.user?.userId, token: $page.data.user?.token }
			)
		} else {
			await del(`users/channel?channelId=${channel._id}`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
		}
	}
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
	<ul
		tabindex="-1"
		class="dropdown-content menu p-2 shadow bg-neutral rounded-box md:w-[23rem] md:m-3">
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
				<label
					for="edit-channel-drawer"
					class="btn col-span-4 border-none font-normal normal-case tooltip tooltip-top flex"
					data-tip="Edit channel"
					on:click={() => (showEditChannelDrawer = true)}>
					Edit channel
				</label>
				<label
					for="modal-delete-channel"
					class="btn col-span-1 bg-error text-black hover:text-white border-none font-normal normal-case tooltip tooltip-left tooltip-error flex"
					data-tip="Delete channel">
					<IconChatDelete />
				</label>
			</div>
		{:else}
			<div class="grid grid-cols-5 gap-2">
				<button
					disabled={!$page.data.user?.userId}
					class="btn btn-secondary {isSubscribing
						? 'btn-outline'
						: ''} col-span-4 normal-case tooltip tooltip-top flex"
					data-tip={isSubscribing ? 'Unsubscribe from host' : 'Subscribe to host'}
					on:click={() => toggleSubscribe()}>
					{isSubscribing ? 'Unsubscribe' : 'Subscribe'}
				</button>
				<button
					disabled={!$page.data.user?.userId}
					class="btn col-span-1 {isFavorite
						? 'bg-yellow-300 text-black hover:bg-yellow-500'
						: ''} border-none font-normal normal-case tooltip tooltip-left flex"
					data-tip="Fav channel"
					on:click={() => toggleFavorite()}>
					<IconChatStar />
				</button>
			</div>
		{/if}
	</ul>
</div>

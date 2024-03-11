<script lang="ts">
	import IconChatDownChevron from '$lib/assets/icons/chat/IconChatDownChevron.svelte'
	import { category_list } from '$lib/stores/channelStore'
	import { copyToClipboard } from '$lib/utils'
	import IconChatDelete from '$lib/assets/icons/chat/IconChatDelete.svelte'
	import IconChatStar from '$lib/assets/icons/chat/IconChatStar.svelte'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { del, get, put } from '$lib/api'
	import { createEffect } from '$lib/utils'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import IconShare from '$lib/assets/icons/channel/IconShare.svelte'

	export let channel: any = undefined,
		showEditChannelDrawer: boolean = false

	const useEffect = createEffect()

	let isHost: boolean = false,
		isFollowing: boolean = false,
		isFavorite: boolean = false

	$: useEffect(() => {
		getHostRelationship()
	}, [channel?._id])

	let copyText = 'Share'
	const changeCopyText = () => {
		copyText = 'Copied!'
		setTimeout(() => {
			copyText = 'Share'
		}, 1000)
	}

	onMount(async () => {
		if ($page.data.user?.userId) {
			isFavorite = await get(`favorite?channelId=${channel._id}`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
		}
	})

	const getHostRelationship = async () => {
		isHost = channel.userId === $page?.data?.user?.userId
		if ($page.data.user?.userId) {
			const relationship = await get(`follows/relationship?source=${channel.userId}`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
			isFollowing = relationship?.isFollowing
		}
	}

	const toggleFollow = async () => {
		isFollowing = !isFollowing
		if (isFollowing) {
			await put(
				`follows`,
				{ source1: channel.userId, source2: $page.data.user?.userId },
				{ userId: $page.data.user?.userId, token: $page.data.user?.token }
			)
		} else {
			await del(`follows?source1=${channel.userId}&source2=${$page.data.user?.userId}`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
		}
	}

	const toggleFavorite = async () => {
		isFavorite = !isFavorite
		if (isFavorite) {
			await put(
				`favorite?channelId=${channel._id}`,
				{},
				{ userId: $page.data.user?.userId, token: $page.data.user?.token }
			)
		} else {
			await del(`favorite?channelId=${channel._id}`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
		}
	}
</script>

<div class="menu dropdown dropdown-bottom z-10">
	<ul tabindex="-1">
		<li>
			<div
				class="p-3 text-xl mb-2 pb-2 border-purple-500 font-semibold border-b-2 justify-between items-center">
				<p class="truncate w-fill">{channel.title || 'Chat'}</p>
				<div class="mt-1 tooltip tooltip-left" data-tip="View channel details">
					<IconChatDownChevron />
				</div>
			</div>
		</li>
	</ul>
	<ul tabindex="-1" class="dropdown-content menu shadow bg-base-200 rounded-box md:w-[23rem]">
		{#if channel.thumbnail}
			<li class="flex flex-row justify-center w-full">
				<div class="w-full shadow-xl">
					<div class="items-center cursor-pointer">
						<img src={channel.thumbnail} alt="Preview" class="rounded-lg h-full" />
					</div>
				</div>
			</li>
		{/if}

		<li on:click={() => copyToClipboard(channel.description)} on:keyup>
			<a class="text-sm max-w-md flex break-all whitespace-normal"
				>{channel.description || 'No description'}</a>
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
								<span class="badge badge-md text-secondary rounded-md font-semibold border-none"
									>{tag}</span>
							</div>
						{/each}
					{/if}
				</div>
			</a>
		</li>
		<li>
			<a href="/{channel.username}">
				<div class="flex flex-wrap gap-2">
					<div class="avatar">
						<div class="w-12 mask {channel.planTier > 0 ? 'mask-hexagon' : 'mask-squircle'}">
							<img src={channel?.avatar} alt="" />
						</div>
					</div>
					<div>
						<div class="col-span-3 flex">
							<p class="truncate">{channel?.displayName}</p>
						</div>
						<div class="col-span-3 flex gap-1">
							<p class="truncate">@{channel.username}</p>
							{#if channel.planTier > 0}
								<div class="text-accent font-bold">
									<IconDrawerVerification />
								</div>
							{/if}
						</div>
					</div>
				</div>
			</a>
		</li>
		{#if isHost}
			<div class="grid grid-cols-5 gap-2">
				<label
					for="edit-channel-drawer"
					class="btn btn-neutral text-white col-span-3 flex tooltip font-normal normal-case"
					data-tip="Edit channel"
					on:click={() => (showEditChannelDrawer = true)}>
					Edit channel
				</label>
				<label
					class="btn col-span-1 text-white border-none tooltip tooltip-top font-normal normal-case btn-neutral flex"
					data-tip={copyText}
					on:click={() => {
						copyToClipboard($page.url.toString())
						changeCopyText()
					}}>
					<IconShare />
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
					class="btn btn-secondary {isFollowing
						? 'btn-outline'
						: ''} col-span-3 normal-case tooltip tooltip-top flex"
					data-tip={isFollowing ? 'Unfollow host' : 'Follow host'}
					on:click={() => toggleFollow()}>
					{isFollowing ? 'Unfollow' : 'Follow'}
				</button>
				<label
					class="btn col-span-1 text-white border-none tooltip tooltip-top font-normal normal-case btn-neutral flex"
					data-tip={copyText}
					on:click={() => {
						copyToClipboard($page.url.toString())
						changeCopyText()
					}}>
					<IconShare />
				</label>
				<button
					disabled={!$page.data.user?.userId}
					class="btn btn-neutral col-span-1 {isFavorite
						? 'bg-yellow-300 text-black hover:bg-yellow-500'
						: ''} border-none font-normal normal-case tooltip tooltip-left flex tooltip-warning"
					data-tip="Fav channel"
					on:click={() => toggleFavorite()}>
					<IconChatStar />
				</button>
			</div>
		{/if}
	</ul>
</div>

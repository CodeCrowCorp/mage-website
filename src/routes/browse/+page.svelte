<script lang="ts">
	import Carousel from '$lib/components/Browse/Carousel.svelte'
	import ChannelSearch from '$lib/components/Browse/ChannelSearch.svelte'
	import ChannelTable from '$lib/components/Browse/ChannelTable.svelte'
	import ChannelSection from '$lib/components/Browse/ChannelSection.svelte'
	import UseSection from '$lib/components/Browse/UserSection.svelte'
	import { onMount } from 'svelte'
	import {
		getMostActiveChannels,
		getWeeklyChannels,
		getMyChannels,
		getFavChannels,
		getChannels,
		getTechListJson,
		techList
	} from '$lib/stores/channelStore'
	import { getHighestRankedUsers } from '$lib/stores/userStore'
	import { currentUser } from '$lib/stores/authStore'

	let mostActiveChannels: any
	let weeklyChannels: any
	let highestRankedUsers: any
	let myChannels: any
	let favChannels: any
	let channels: any
	onMount(async () => {
		if (!$techList.length) {
			await getTechListJson()
		}
		mostActiveChannels = [] // await getMostActiveChannels({ skip: 0, limit: 10 })
		weeklyChannels = [] // await getWeeklyChannels({ skip: 0, limit: 10 })
		highestRankedUsers = [] // await getHighestRankedUsers({ skip: 0, limit: 10 })
		myChannels = [] // await getMyChannels({ skip: 0, limit: 10 })
		favChannels = [] // await getFavChannels({ skip: 0, limit: 10 })
		channels = await getChannels({ skip: 0, limit: 50 })
	})
</script>

{#if mostActiveChannels && mostActiveChannels.length > 0}
	<Carousel bind:channels={mostActiveChannels} />
{/if}

<ChannelSearch />

<div class="flex flex-col gap-4 px-24 justify-around">
	<div class="flex flex-row gap-4">
		<div class="w-[28rem] bg-gray-200">
			<img
				src="http://source.unsplash.com/800x800/?tree"
				class="w-full max-h-64 border-none rounded shadow"
				alt="" />
		</div>

		<div class="flex-auto flex flex-col gap-2">
			<div>
				<div class="badge badge-primary">primary</div>
			</div>

			<h2 class="text-xl font-semibold dark:text-white">
				Envato Elements Ad - The Creators Key - 30s - Subtitles Burned
			</h2>

			<p class="text-sm font-light">16k Views - 10 hours ago</p>

			<div class="flex items-center">
				<div class="avatar">
					<div class="w-8 rounded-full">
						<img src="https://via.placeholder.com/300/09f/fff.png" alt="" />
					</div>
				</div>
				<p class="ml-2 text-sm font-light text-center">channel 1</p>
			</div>

			<p class="text-sm font-light">
				This channel is to discuss everything regarding SQA subject. This channel is to discuss
				everything regarding SQA subject.
			</p>

			<div>
				<div class="badge">neutral</div>
			</div>
		</div>
	</div>
	<div class="flex flex-row gap-4">
		<div class="w-[28rem] bg-gray-200">
			<img
				src="http://source.unsplash.com/800x800/?tree"
				class="w-full max-h-64 border-none rounded shadow"
				alt="" />
		</div>

		<div class="flex-auto flex flex-col gap-2">
			<div>
				<div class="badge badge-primary">primary</div>
			</div>

			<h2 class="text-xl font-semibold dark:text-white">
				Envato Elements Ad - The Creators Key - 30s - Subtitles Burned
			</h2>

			<p class="text-sm font-light">16k Views - 10 hours ago</p>

			<div class="flex items-center">
				<div class="avatar">
					<div class="w-8 rounded-full">
						<img src="https://via.placeholder.com/300/09f/fff.png" alt="" />
					</div>
				</div>
				<p class="ml-2 text-sm font-light text-center">channel 1</p>
			</div>

			<p class="text-sm font-light">
				This channel is to discuss everything regarding SQA subject. This channel is to discuss
				everything regarding SQA subject.
			</p>

			<div>
				<div class="badge">neutral</div>
			</div>
		</div>
	</div>
	<div class="flex flex-row gap-4">
		<div class="w-[28rem] bg-gray-200">
			<img
				src="http://source.unsplash.com/800x800/?tree"
				class="w-full max-h-64 border-none rounded shadow"
				alt="" />
		</div>

		<div class="flex-auto flex flex-col gap-2">
			<div>
				<div class="badge badge-primary">primary</div>
			</div>

			<h2 class="text-xl font-semibold dark:text-white">
				Envato Elements Ad - The Creators Key - 30s - Subtitles Burned
			</h2>

			<p class="text-sm font-light">16k Views - 10 hours ago</p>

			<div class="flex items-center">
				<div class="avatar">
					<div class="w-8 rounded-full">
						<img src="https://via.placeholder.com/300/09f/fff.png" alt="" />
					</div>
				</div>
				<p class="ml-2 text-sm font-light text-center">channel 1</p>
			</div>

			<p class="text-sm font-light">
				This channel is to discuss everything regarding SQA subject. This channel is to discuss
				everything regarding SQA subject.
			</p>

			<div>
				<div class="badge">neutral</div>
			</div>
		</div>
	</div>
	<div class="flex flex-row gap-4">
		<div class="w-96 bg-gray-200">
			<img
				src="http://source.unsplash.com/800x800/?tree"
				class="w-full max-h-72 border-none rounded shadow"
				alt="" />
		</div>

		<div class="flex-auto flex flex-col gap-2">
			<div>
				<div class="badge badge-primary">primary</div>
			</div>

			<h2 class="text-xl font-semibold dark:text-white">
				Envato Elements Ad - The Creators Key - 30s - Subtitles Burned
			</h2>

			<p class="text-sm font-light">16k Views - 10 hours ago</p>

			<div class="flex items-center">
				<div class="avatar">
					<div class="w-8 rounded-full">
						<img src="https://via.placeholder.com/300/09f/fff.png" alt="" />
					</div>
				</div>
				<p class="ml-2 text-sm font-light text-center">channel 1</p>
			</div>

			<p class="text-sm font-light">
				This channel is to discuss everything regarding SQA subject. This channel is to discuss
				everything regarding SQA subject.
			</p>

			<div>
				<div class="badge">neutral</div>
			</div>
		</div>
	</div>
	<div class="flex flex-row gap-4">
		<div class="w-96 bg-gray-200">
			<img
				src="http://source.unsplash.com/800x800/?tree"
				class="w-full max-h-72 border-none rounded shadow"
				alt="" />
		</div>

		<div class="flex-auto flex flex-col gap-2">
			<div>
				<div class="badge badge-primary">primary</div>
			</div>

			<h2 class="text-xl font-semibold dark:text-white">
				Envato Elements Ad - The Creators Key - 30s - Subtitles Burned
			</h2>

			<p class="text-sm font-light">16k Views - 10 hours ago</p>

			<div class="flex items-center">
				<div class="avatar">
					<div class="w-8 rounded-full">
						<img src="https://via.placeholder.com/300/09f/fff.png" alt="" />
					</div>
				</div>
				<p class="ml-2 text-sm font-light text-center">channel 1</p>
			</div>

			<p class="text-sm font-light">
				This channel is to discuss everything regarding SQA subject. This channel is to discuss
				everything regarding SQA subject.
			</p>

			<div>
				<div class="badge">neutral</div>
			</div>
		</div>
	</div>
</div>

{#if weeklyChannels && weeklyChannels.length > 0}
	<ChannelSection
		title="Wk${weeklyChannels.weekly.weekNumber} ${weeklyChannels.weekly.topic}"
		bind:channels={weeklyChannels.channels} />
{/if}

{#if highestRankedUsers && highestRankedUsers.length > 0}
	<UseSection title="Highest ranked" bind:users={highestRankedUsers} />
{/if}

<!-- <UseSection title="Rising stars" bind:channels /> -->

{#if $currentUser && myChannels && myChannels.length > 0}
	<ChannelSection title="My channels" bind:channels={myChannels} />
{/if}

{#if $currentUser && favChannels && favChannels.length > 0}
	<ChannelSection title="Fav channels" bind:channels={favChannels} />
{/if}

{#if channels && channels.length > 0}
	<ChannelTable bind:channels />
{/if}

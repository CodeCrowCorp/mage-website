<script lang="ts">
	import { onMount } from 'svelte'
	import { getTechListJson, techList } from '$lib/stores/channelStore'
	import SectionCarousel from '$lib/components/Browse/Sections/SectionCarousel.svelte'
	import SectionChannel from '$lib/components/Browse/Sections/SectionChannel.svelte'
	import SearchBar from '$lib/components/Browse/SearchBar.svelte'
	import SectionUser from '$lib/components/Browse/Sections/SectionUser.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	import type { PageData } from './$types'
	import { current_user } from '$lib/stores/authStore'
	import { get } from '$lib/api'

	export let data: PageData
	$: ({ user } = data)

	let mostActiveChannels: any = []
	let weeklyChannels: any = []
	let weeklyTitle: string = ''
	let highestRankedUsers: any = []
	let risingStarUsers: any = []
	let myChannels: any = []
	let favChannels: any = []
	let tableChannels: any = []
	let isLoading: boolean = false

	onMount(async () => {
		isLoading = true
		if (!$techList.length) {
			await getTechListJson()
		}
		mostActiveChannels = await get(`channels/most-active?skip=${0}&limit=${5}`)
		weeklyChannels = []
		// await get(`channels/weekly?skip=${0}&limit=${10}`)
		// if (!weeklyChannels.error) {
		// 	weeklyTitle = `Wk${weeklyChannels.weekly.weekNumber} ${weeklyChannels.weekly.topic}`
		// 	weeklyChannels = weeklyChannels.channels
		// } else {
		// 	weeklyChannels = weeklyChannels
		// }

		highestRankedUsers = await get(`users/highest-ranked?skip=${0}&limit=${10}`)
		risingStarUsers = await get(`users/rising-stars?skip=${0}&limit=${10}`)

		if (user) {
			myChannels = await get(`channels/me/hosted?skip=${0}&limit=${10}`, {
				userId: user.userId,
				token: user.token
			})
			favChannels = await get(`channels/me/fav?skip=${0}&limit=${10}`, {
				userId: user.userId,
				token: user.token
			})
		}
		tableChannels = await get(`channels?skip=${0}&limit=${50}`)
		isLoading = false
	})
</script>

<SectionCarousel bind:channels={mostActiveChannels} bind:isLoading />
<SearchBar {user} />

<SectionChannel
	sectionId={'weekly'}
	title={weeklyTitle}
	bind:channels={weeklyChannels}
	bind:isLoading />

<SectionUser
	sectionId={'highest-ranked'}
	title="Highest ranked"
	bind:users={highestRankedUsers}
	bind:isLoading />

<SectionUser
	sectionId={'rising-stars'}
	title="Rising stars"
	bind:users={risingStarUsers}
	bind:isLoading />

{#if current_user}
	<SectionChannel sectionId={'my'} title="My channels" bind:channels={myChannels} bind:isLoading />

	<SectionChannel
		sectionId={'fav'}
		title="Fav channels"
		bind:channels={favChannels}
		bind:isLoading />
{/if}

<SectionTable bind:channels={tableChannels} bind:isLoading />

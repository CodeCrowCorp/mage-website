<script lang="ts">
	import SectionCarousel from '$lib/components/Browse/Sections/SectionCarousel.svelte'
	import SectionChannel from '$lib/components/Browse/Sections/SectionChannel.svelte'
	import SearchBar from '$lib/components/Browse/SearchBar.svelte'
	import SectionUser from '$lib/components/Browse/Sections/SectionUser.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { get, patch } from '$lib/api'
	import { getSectionUrl } from '$lib/utils'

	export let data: PageData
	$: user = $page.data.user

	onMount(async () => {
		const allChannels = await get(getSectionUrl({ sectionId: '', query: '', skip: 0, limit: 500 }))
		console.log('got here----', allChannels)
		allChannels.forEach(async (element: any) => {
			let created = ''
			if (element?.createdOn) {
				created = element?.createdOn
			} else {
				created = element?.createdAt
			}
			console.log('got here----createdAt', created)
			element.createdAt = created
			await patch(`channels`, element, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
		})
	})
</script>

<SectionCarousel bind:channels={data.lazy.mostActiveChannels} />
<SearchBar />

<SectionChannel sectionId={'weekly'} bind:channels={data.lazy.weeklyChannels} />

<SectionUser
	sectionId={'highest-ranked'}
	title="Highest ranked"
	bind:users={data.lazy.highestRankedUsers} />

<SectionUser
	sectionId={'rising-stars'}
	title="Rising stars"
	bind:users={data.lazy.risingStarUsers} />

{#if user}
	<SectionChannel sectionId={'my'} title="My channels" bind:channels={data.lazy.myChannels} />

	<SectionChannel sectionId={'fav'} title="Fav channels" bind:channels={data.lazy.favChannels} />
{/if}

<SectionTable bind:channels={data.lazy.tableChannels} />

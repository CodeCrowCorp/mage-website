<script lang="ts">
	import SectionCarousel from '$lib/components/Browse/Sections/SectionCarousel.svelte'
	import SectionChannel from '$lib/components/Browse/Sections/SectionChannel.svelte'
	import SearchBar from '$lib/components/Browse/SearchBar.svelte'
	import SectionUser from '$lib/components/Browse/Sections/SectionUser.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	export let data: PageData
	$: user = $page.data.user
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

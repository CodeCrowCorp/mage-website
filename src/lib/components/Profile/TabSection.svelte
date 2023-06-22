<script lang="ts">
	import ListSubscribe from '$lib/components/Profile/ListSubscribe.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	import Stats from '$lib/components/Profile/Elements/Stats.svelte'

	export let profileId: string = '',
		channels: Promise<any>,
		subscribers: Promise<any>,
		interests: Promise<any>

	let tabs = ['Stats', 'Channels', 'Subscribers']
	let activeTab = 0
</script>

<div class="mt-10 py-10 border-t border-blueGray-200 text-center">
	<div class="flex flex-wrap justify-center">
		<div class="tabs tabs-boxed flex justify-center mb-5 w-fit">
			{#each tabs as tab, index}
				<button
					class="tab"
					class:tab-active={activeTab == index}
					on:click={() => (activeTab = index)}>{tab}</button>
			{/each}
		</div>
		<div class="w-full px-4">
			<div class="grid h-full" class:hidden={activeTab != 0}>
				<Stats />
			</div>
			<div class="flex-auto h-full text-left" class:hidden={activeTab != 1}>
				<SectionTable {channels} {profileId} />
			</div>
			<div class="flex-auto h-full" class:hidden={activeTab != 2}>
				<ListSubscribe {subscribers} {interests} />
			</div>
		</div>
	</div>
</div>

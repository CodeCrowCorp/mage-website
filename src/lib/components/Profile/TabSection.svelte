<script lang="ts">
	// import ListSubscribe from '$lib/components/Profile/ListSubscribe.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	// import Stats from '$lib/components/Profile/Elements/Stats.svelte'

	export let channels: Promise<any>, subscribers: Promise<any>, interests: Promise<any>

	let tabs = ['Channels'] //['Stats', 'Channels', 'Subscribers']
	let activeTab = 0
</script>

<div class="mt-10 py-10 border-t border-blueGray-200 text-center">
	<div class="flex flex-wrap justify-center">
		<div class="w-full px-4">
			<div class="tabs-boxed flex justify-center bg-base-100 pb-10">
				{#each tabs as tab, index}
					<button
						class="tab"
						class:tab-active={activeTab == index}
						on:click={() => (activeTab = index)}>{tab}</button>
				{/each}
			</div>
			<!-- <div class="grid h-full bg-base-100 py-10" class:hidden={activeTab != 0}>
				<Stats />
			</div> -->
			<div class="flex-auto h-full text-left" class:hidden={activeTab != 0}>
				{#await channels}
					<progress class="progress w-full" />
				{:then value}
					<SectionTable channels={value} />
				{/await}
			</div>
			<!-- <div class="flex-auto h-full" class:hidden={activeTab != 2}>
				<ListSubscribe {subscribers} {interests} />
			</div> -->
		</div>
	</div>
</div>

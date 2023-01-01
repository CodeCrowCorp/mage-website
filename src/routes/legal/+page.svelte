<script lang="ts">
	import type { PageData } from './$types'
	export let data: PageData
	let activeTab = 0
</script>
<div class="h-screen flex justify-center flex-col">
	<div class="tabs tabs-boxed flex justify-center">
		{#each data.post as doc, index}
		  <button class="tab" class:tab-active={activeTab == index} on:click={()=>activeTab = index}>{doc.name}</button>
		{/each}
	</div>
	<iframe class="flex-auto h-full" title='legal' src={data.post[activeTab].url}></iframe>
</div>
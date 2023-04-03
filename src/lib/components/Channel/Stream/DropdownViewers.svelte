<script lang="ts">
	import Viewer from '$lib/components/Channel/Stream/Viewer.svelte'
	export let viewers: any = []
	viewers = [
		{ username: 'test', role: 'Host' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' },
		{ username: 'test', role: 'Mod' }
	]
</script>

<ul
	tabindex="-1"
	class="dropdown-content p-2 shadow bg-base-200 rounded-box m-3 flex flex-col h-96 overflow-y-scroll">
	{#each viewers as user}
		<Viewer {user} />
	{/each}
</ul>

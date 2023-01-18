<script>
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	const channels = ['audio', 'video', 'video more', 'game']
</script>

<div class="flex flex-col my-4">
	<div class="font-semibold my-3">Channel Group Section</div>

	<div class="relative flex flex-row">
		<div class="absolute bg-white rounded-full p-2 left-0 top-2/3">
			<IconDrawerChevron />
		</div>

		<div class="flex flex-row space-x-4 w-full">
			{#each channels as channel}
				<div class="bg-slate-300 w-full h-64 rounded-md flex justify-center items-center">
					{channel}
				</div>
			{/each}
		</div>

		<div class="absolute bg-white rounded-full p-2 right-0 top-2/3">
			<IconDrawerChevron />
		</div>
	</div>
</div>

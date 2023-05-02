<script>
	import IconBrowseItemPlay from '$lib/assets/icons/browse/IconBrowseItemPlay.svelte'
	import IconBrowseItemUser from '$lib/assets/icons/browse/IconBrowseItemUser.svelte'
</script>

<div
	role="status"
	class="max-w-sm border border-gray-200 rounded shadow md:p-6 dark:border-gray-700 mx-3">
	<div class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
		<IconBrowseItemPlay />
	</div>
	<div class="flex items-center mt-4 space-x-3">
		<IconBrowseItemUser />
		<div>
			<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2" />
			<div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
		</div>
	</div>
	<span class="sr-only">Loading...</span>
</div>

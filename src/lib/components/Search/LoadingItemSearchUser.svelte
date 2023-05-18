<script>
	import IconBrowseItemUser from '$lib/assets/icons/browse/IconBrowseItemUser.svelte'
</script>

<div
	role="status"
	class="w-full p-4 border border-gray-200 rounded-md shadow md:p-6 dark:border-gray-700">
	<div class="flex flex-col md:flex-row gap-4 w-full">
		<div class="min-w-[10rem]">
			<div
				class="flex items-center justify-center h-40 border border-gray-200 rounded-md shadow md:p-6 dark:border-gray-700">
				<IconBrowseItemUser />
			</div>
		</div>
		<div class="flex-auto flex flex-col gap-2">
			<div class="flex gap-2 mb-2.5">
				<div class="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-8" />
				<div class="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-8" />
				<div class="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-8" />
				<div class="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-8" />
			</div>
			<div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2.5" />
			<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-2.5" />
			<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
			<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mb-2.5" />
			<div class="flex gap-2 mb-2.5">
				<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-8" />
				<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20" />
			</div>
			<span class="sr-only">Loading...</span>
		</div>
	</div>
</div>

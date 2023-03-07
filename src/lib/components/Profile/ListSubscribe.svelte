<script lang="ts">
	import SubscriberItem from './Elements/SubscriberItem.svelte'

	export let subscribers
</script>

<div class="flex flex-row justify-center gap-5 mt-8">
	<div class="flex flex-col w-2/4 gap-2 bg-blue-200 py-4 px-8">
		<p class="text-start text-black font-semibold">Following (30)</p>

		<div class="relative w-full">
			<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
				<svg
					aria-hidden="true"
					class="w-5 h-5 text-gray-500 dark:text-gray-400"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd" />
				</svg>
			</div>
			<input
				type="text"
				class="bg-gray-50 input input-primary text-sm rounded-lg  block w-full dark:text-white "
				placeholder="Search"
				required />
		</div>

		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
	</div>

	<div class="flex flex-col w-2/4 gap-2 bg-pink-100 py-4 px-8">
		<p class="text-start text-black font-semibold">Followers (30)</p>
		<div class="relative w-full">
			<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
				<svg
					aria-hidden="true"
					class="w-5 h-5 text-gray-500 dark:text-gray-400"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd" />
				</svg>
			</div>
			<input
				type="text"
				class="bg-gray-50 input input-primary text-sm rounded-lg  block w-full dark:text-white "
				placeholder="Search"
				required />
		</div>
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
	</div>
</div>

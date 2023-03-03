<script lang="ts">
	import SubscriberItem from './Elements/SubscriberItem.svelte'

	export let subscribers: any = []
</script>

<div class="flex flex-row justify-center gap-5 mt-8">
	<div class="flex flex-col w-2/4 gap-2 bg-blue-200 py-4 px-8">
		<p class="text-start text-black font-semibold">Following (30)</p>
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
	</div>

	<div class="flex flex-col w-2/4 gap-2 bg-pink-100 py-4 px-8">
		<p class="text-start text-black font-semibold">Followers (30)</p>

		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
		<SubscriberItem />
	</div>
</div>

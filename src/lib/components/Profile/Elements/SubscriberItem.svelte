<script lang="ts">
	import { page } from '$app/stores'
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	export let subscriberItem: any
</script>

<div class="flex flex-row gap-2 px-4 py-2 rounded-md bg-slate-100 justify-between">
	<div class="flex">
		<div class="avatar">
			<div class="w-16 rounded-full">
				<img src={subscriberItem.avatar} alt="" />
			</div>
		</div>

		<div class="flex flex-col justify-center pl-4 text-start">
			<p class="text-black">{subscriberItem.displayName}</p>
			<p class="text-secondary">{subscriberItem.username}</p>
		</div>
	</div>

	<div class="flex flex-row items-center">
		<div>
			<button
				class="btn rounded-3xl py-1 btn-sm btn-secondary"
				disabled={subscriberItem?._id === $page.data.user?.userId}>Subscribe</button>
		</div>

		<div class="dropdown dropdown-end">
			<button class="text-black btn-md" tabindex="0">
				<IconMore />
			</button>
			<ul tabindex="-1" class="dropdown-content menu shadow bg-base-200 rounded-box w-52">
				<li>
					<span>Profile</span>
				</li>
				<!-- <li>
					<span>Message</span>
				</li> -->
			</ul>
		</div>
	</div>
</div>

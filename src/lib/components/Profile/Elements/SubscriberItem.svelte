<script lang="ts">
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	import { page } from '$app/stores'

	export let subscriberItem: any
	console.log(subscriberItem)
</script>

<div class="flex flex-row gap-2 px-4 py-2 rounded-md bg-slate-100 justify-between">
	{#await subscriberItem}
		<div class="flex">
			<div class="avatar">
				<div class="w-16 rounded-full">
					<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" />
				</div>
			</div>

			<div class="flex flex-col justify-center pl-4 text-start">
				<p class="text-black">DisplayName</p>
				<p class="text-secondary">Username</p>
			</div>
		</div>

		<div class="flex flex-row items-center">
			<div>
				<button class="btn rounded-3xl py-1 btn-sm btn-secondary">Follow</button>
			</div>

			<div class="dropdown dropdown-end">
				<button class="text-black btn-md" tabindex="0">
					<IconMore />
				</button>
				<ul tabindex="-1" class="dropdown-content menu shadow bg-base-200 rounded-box w-52">
					<li>
						<span>Profile</span>
					</li>
					<li>
						<span>Message</span>
					</li>
				</ul>
			</div>
		</div>
	{:then value}
		<div class="flex">
			<div class="avatar">
				<div class="w-16 rounded-full">
					<img src={value.avatar} alt="" />
				</div>
			</div>

			<div class="flex flex-col justify-center pl-4 text-start">
				<p class="text-black">{value.displayName}</p>
				<p class="text-secondary">{value.username}</p>
			</div>
		</div>

		<div class="flex flex-row items-center">
			<div>
				<button
					class="btn rounded-3xl py-1 btn-sm btn-secondary"
					disabled={value?._id === $page.data.user?.userId}>Follow</button>
			</div>

			<div class="dropdown dropdown-end">
				<button class="text-black btn-md" tabindex="0">
					<IconMore />
				</button>
				<ul tabindex="-1" class="dropdown-content menu shadow bg-base-200 rounded-box w-52">
					<li>
						<span>Profile</span>
					</li>
					<li>
						<span>Message</span>
					</li>
				</ul>
			</div>
		</div>
	{/await}
</div>

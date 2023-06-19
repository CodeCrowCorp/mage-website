<script lang="ts">
	import { page } from '$app/stores'
	import { get } from '$lib/api'
	import { onMount } from 'svelte'

	export let userId: string
	let profile: any, subscriberCount: number, interestCount: number, isSubscribed: boolean

	onMount(async () => {
		profile = await get(`users/search/id?userId=${userId}`)
		subscriberCount = await get(`subscribes/count?source=${userId}&sourceType=source1`)
		interestCount = await get(`subscribes/count?source=${userId}&sourceType=source2`)
		if ($page.data.user?.userId) {
			isSubscribed = await get(`subscribes/relationship?source=${profile._id}`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
		}
	})
</script>

{#if !profile}
	<progress class="progress w-full" />
{:else}
	<div
		data-popover
		role="tooltip"
		class="absolute z-10 invisible inline-block w-64 text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600">
		<div class="p-3">
			{#if $page.data.user?.userId}
				<div class="flex items-center justify-between mb-2">
					<a href="">
						<img class="w-10 h-10 rounded-full" src={profile.avatar} alt={profile.avatar} />
					</a>
					<div>
						<button type="button" class="btn">Subscribe</button>
					</div>
				</div>
			{/if}
			<p class="text-base font-semibold leading-none">
				<a href="">{profile.displayName}</a>
			</p>
			<p class="mb-3 text-sm font-normal">
				<a href="" class="hover:underline">@{profile.username}</a>
			</p>
			<p class="mb-4 text-sm font-light">
				{profile.bio}
			</p>
			<ul class="flex text-sm font-light">
				<li class="mr-2">
					<a href="" class="hover:underline">
						<span class="font-semibold">{subscriberCount}</span>
						<span>Subscribers</span>
					</a>
				</li>
				<li>
					<a href="" class="hover:underline">
						<span class="font-semibold">{interestCount}</span>
						<span>Interests</span>
					</a>
				</li>
			</ul>
		</div>
		<div data-popper-arrow />
	</div>
{/if}

<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import DrawerEditProfile from '$lib/components/Profile/DrawerEditProfile.svelte'
	import { get } from '$lib/api'
	import { getTechListJson, techList } from '$lib/stores/channelStore'
	import StatSection from '$lib/components/Profile/StatSection.svelte'
	import TopSection from '$lib/components/Profile/TopSection.svelte'
	import UserDetails from '$lib/components/Profile/Elements/UserDetails.svelte'

	export let data
	$: ({ profile } = data)

	let showDrawer = false
	let myChannels = []
	let mySubscribers = []
	// let profile = {}

	onMount(async () => {
		if (!$techList.length) {
			await getTechListJson()
		}

		// profile = await get(`users/search/username?username=${$page.params.customUsername}`)
		// // const user = await get(`users/search/id?userId=${profile._id}`)

		// console.log(profile)
		// if (profile) {
		// 	myChannels = await get(`channels/me/hosted?skip=${0}&limit=${10}`, {
		// 		userId: profile._id,
		// 		token: profile.token
		// 	})
		// 	// console.log(myChannels)

		// 	mySubscribers = await get(
		// 		`subscribe?source=${
		// 			profile._id
		// 		}&sourceType=${'source2'}&searchQuery=${''}&skip=${0}&limit=${10}`,
		// 		{
		// 			userId: profile._id,
		// 			token: profile.token
		// 		}
		// 	)
		// 	// console.log(mySubscribers)
		// }
	})
</script>

<div class="relative block h-[31rem]">
	<div
		class="absolute top-0 w-full h-full bg-center bg-cover"
		style="
            background-image: url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80');
          ">
		<span id="blackOverlay" class="w-full h-full absolute opacity-50 bg-black" />
	</div>
	<div
		class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-32"
		style="transform: translateZ(0px)">
		<svg
			class="absolute bottom-0 overflow-hidden"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
			version="1.1"
			viewBox="0 0 2560 100"
			x="0"
			y="0">
			<polygon class="text-base-200 fill-current" points="2560 0 2560 100 0 100" />
		</svg>
	</div>
</div>
<div class="relative py-16">
	<div class="container mx-auto px-4">
		<div
			class="relative flex flex-col min-w-0 break-words bg-base-100 w-full mb-6 shadow-xl rounded-lg -mt-64">
			<div class="px-6">
				<TopSection bind:profile bind:showDrawer />
				<UserDetails bind:profile bind:techList={$techList} />
				<StatSection
					bind:myChannels={data.lazy.myChannels}
					bind:mySubscribers={data.lazy.mySubscribers} />
			</div>
		</div>
	</div>
</div>

{#if showDrawer}
	<DrawerEditProfile bind:profile bind:showDrawer />
{/if}

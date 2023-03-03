<script lang="ts">
	import IconLink from '$lib/assets/icons/IconLink.svelte'
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	import ListSubscribe from '$lib/components/Profile/ListSubscribe.svelte'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import DrawerEditProfile from '$lib/components/Profile/DrawerEditProfile.svelte'
	import { get } from '$lib/api'
	import AvatarLoader from '$lib/components/Profile/Elements/AvatarLoader.svelte'
	import NameLoader from '$lib/components/Profile/Elements/NameLoader.svelte'
	import CategoryLoader from '$lib/components/Profile/Elements/CategoryLoader.svelte'
	import { getTechListJson, techList } from '$lib/stores/channelStore'
	import StatSection from '$lib/components/Profile/StatSection.svelte'

	let tabs = ['Stats', 'Channels', 'Subscribers']
	let activeTab = 0
	let showDrawer = false
	let isLoading = false
	let myChannels = []
	let mySubscribers = []
	let profile = {}

	$: currentUser = $page.data?.user?.user

	// let profile: {
	// 	_id: string
	// 	username: string
	// 	avatar: string
	// 	displayName: string
	// 	bio: string
	// 	description: string
	// 	html_url: string
	// 	token: string
	// } = {
	// 	_id: '',
	// 	username: '',
	// 	avatar: '',
	// 	displayName: '',
	// 	bio: '',
	// 	description: '',
	// 	html_url: '',
	// 	token: ''
	// }

	onMount(async () => {
		isLoading = true

		if (!$techList.length) {
			await getTechListJson()
		}

		profile = await get(`users/search/username?username=${$page.params.customUsername}`)
		// const user = await get(`users/search/id?userId=${profile._id}`)

		console.log(profile)
		if (profile) {
			myChannels = await get(`channels/me/hosted?skip=${0}&limit=${10}`, {
				userId: profile._id,
				token: profile.token
			})
			// console.log(myChannels)

			mySubscribers = await get(
				`subscribe?source=${
					profile._id
				}&sourceType=${'user'}&searchQuery=${''}&skip=${0}&limit=${10}`,
				{
					userId: profile._id,
					token: profile.token
				}
			)
			console.log(mySubscribers)
		}

		isLoading = false
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
				<div class="flex flex-wrap justify-center">
					<div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
						<div class="relative">
							{#if profile?.avatar}
								<!-- <div
									class="mask mask-squircle h-auto align-middle absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px">
									<img src={profile?.avatar} alt="" />
								</div> -->
								<div class="w-32 h-32">
									<div class="avatar -top-16 {profile?.isOnline ? 'online' : 'offline'}">
										<div class="mask mask-squircle h-auto align-middle max-w-150-px">
											<img src={profile?.avatar} alt="" />
										</div>
									</div>
								</div>
							{:else}
								<AvatarLoader />
							{/if}
						</div>
					</div>
					<div class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
						<div class="py-6 px-3 mt-32 sm:mt-0 flex justify-end gap-4">
							<button class="btn btn-secondary">Subscribe</button>
							<button class="btn btn-primary" disabled>Sponsor</button>
							{#if currentUser.username === $page.params.customUsername}
								<div class="dropdown dropdown-end">
									<button class="btn btn-circle btn-primary" tabindex="0">
										<IconMore />
									</button>
									<ul
										tabindex="-1"
										class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
										<li>
											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<label for="edit-profile-drawer" on:click={() => (showDrawer = true)}>
												Edit</label>
										</li>
									</ul>
								</div>
							{/if}
						</div>
					</div>
					<div class="w-full lg:w-4/12 px-4 lg:order-1">
						<div class="flex justify-center py-4 lg:pt-4 pt-8">
							<div class="mr-4 p-3 text-center tooltip" data-tip="22 subscribers">
								<span class="text-xl font-bold block uppercase tracking-wide">22</span><span
									class="text-sm">Subscribers</span>
							</div>
							<div class="mr-4 p-3 text-center tooltip" data-tip="10 interests">
								<span class="text-xl font-bold block uppercase tracking-wide">10</span><span
									class="text-sm">Interests</span>
							</div>
							<div class="lg:mr-4 p-3 text-center tooltip" data-tip="2045 unique profile views">
								<span class="text-xl font-bold block uppercase tracking-wide">2045</span><span
									class="text-sm">Views</span>
							</div>
						</div>
					</div>
				</div>
				<div class="text-center flex flex-col items-center">
					{#if profile?.displayName}
						<h3 class="text-4xl font-semibold leading-normal mb-2">
							{profile?.displayName || ''}
						</h3>
					{:else}
						<NameLoader />
					{/if}
					{#if profile?.username}
						<div class="text-lg leading-normal mt-0 mb-2 font-bold text-pink-500">
							@{profile?.username || ''}
						</div>
					{:else}
						<NameLoader />
					{/if}
					{#if profile?.bio || profile?.description}
						<div class="text-lg leading-normal mt-0 mb-2">
							{profile?.bio || profile?.description || ''}
						</div>
					{/if}
					<div class="pt-4">
						{#if profile?.html_url}
							<div class="flex gap-2 justify-center p-4">
								<IconLink />
								<a class="link link-info" href={profile?.html_url} target="_blank" rel="noreferrer"
									>{profile?.html_url || ''}</a>
							</div>
						{/if}
						<div class="flex gap-2 justify-center">
							{#if profile?.category}
								{#if profile?.category.length}
									{#each profile.category as category}
										<div class="tooltip" data-tip={category}>
											<img src={$techList[category]} alt="" class="h-7 w-7 m-1" />
										</div>
									{/each}
								{:else}
									<CategoryLoader />
								{/if}
							{/if}
						</div>
					</div>
				</div>
				<StatSection bind:myChannels bind:mySubscribers bind:isLoading />
			</div>
		</div>
	</div>
</div>

{#if showDrawer}
	<DrawerEditProfile bind:profile bind:showDrawer />
{/if}

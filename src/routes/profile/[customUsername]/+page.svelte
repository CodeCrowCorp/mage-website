<script lang="ts">
	import IconLink from '$lib/assets/icons/IconLink.svelte'
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	import ListSubscribe from '$lib/components/Profile/ListSubscribe.svelte'
	// import type { PageData } from './$types' // THIS ONE making issue
	import { current_user } from '$lib/stores/authStore'
	import { get } from '$lib/api'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import DrawerEditProfile from '$lib/components/Profile/DrawerEditProfile.svelte'

	export let data

	let tabs = ['Stats', 'Channels', 'Subscribers']
	let activeTab = 0
	let profileData = {}
	let showDrawer = false

	$: ({ user } = data)

	onMount(async () => {
		if (user) {
			profileData = await get(`users/search/username?username=${$page.params.customUsername}`, {
				// profileData = await get(`users/search/username?username=gagan_suie`, {
				userId: user.userId,
				token: user.token
			})
			console.log(profileData)
		}
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
							<div
								class="mask mask-squircle h-auto align-middle absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px">
								<img alt="..." src={profileData?.avatar} />
							</div>
						</div>
					</div>
					<div class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
						<div class="py-6 px-3 mt-32 sm:mt-0 flex justify-end gap-4">
							<button class="btn btn-secondary">Subscribe</button>
							<button class="btn btn-primary" disabled>Sponsor</button>
							{#if $current_user.username === $page.params.customUsername}
								<div class="dropdown dropdown-end">
									<button class="btn btn-circle" tabindex="0">
										<IconMore />
									</button>
									<ul
										tabindex="-1"
										class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
										<li>
											<label for="edit-profile-drawer" on:click={() => (showDrawer = true)}>
												Edit</label>
										</li>
										<!-- <li><a>Message</a></li>
									<li><a>Block</a></li>
									<li><a>Report</a></li> -->
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
				<div class="text-center mt-12">
					<h3 class="text-4xl font-semibold leading-normal mb-2">{profileData?.displayName}</h3>
					<div class="text-lg leading-normal mt-0 mb-2 font-bold text-pink-500">
						@{profileData?.username || ''}
					</div>
					<div class="text-lg leading-normal mt-0 mb-2">{profileData?.bio || ''}</div>
					<div class="pt-4">
						<div class="flex gap-2 justify-center p-4">
							<IconLink />
							<a class="link link-info">{profileData?.html_url || ''}</a>
						</div>
						<div class="flex gap-2 justify-center">
							<img src="/category-optimized/games/call-of-duty-black-ops-4.svg" />
							<img src="/category-optimized/games/fortnite.svg" />
							<img src="/category-optimized/games/overwatch.svg" />
							<img src="/category-optimized/games/valorant.svg" />
						</div>
					</div>
				</div>
				<div class="mt-10 py-10 border-t border-blueGray-200 text-center">
					<div class="flex flex-wrap justify-center">
						<div class="w-full lg:w-9/12 px-4">
							<div class="tabs tabs-boxed flex justify-center bg-base-100">
								{#each tabs as tab, index}
									<button
										class="tab"
										class:tab-active={activeTab == index}
										on:click={() => (activeTab = index)}>{tab}</button>
								{/each}
							</div>
							<div class="grid h-full bg-base-100 py-10" class:hidden={activeTab != 0}>
								<div class="tooltip" data-tip="level 1">
									<progress class="progress progress-accent w-64" value="30" max="100" />
								</div>
								<div class="stats shadow bg-base-200">
									<div class="stat">
										<div class="stat-figure text-primary">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												class="inline-block w-8 h-8 stroke-current"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
										</div>
										<div class="stat-title">Total Likes</div>
										<div class="stat-value text-primary">25.6K</div>
										<div class="stat-desc">21% more than last month</div>
									</div>

									<div class="stat">
										<div class="stat-figure text-secondary">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												class="inline-block w-8 h-8 stroke-current"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
										</div>
										<div class="stat-title">Page Views</div>
										<div class="stat-value text-secondary">2.6M</div>
										<div class="stat-desc">21% more than last month</div>
									</div>

									<div class="stat">
										<div class="stat-figure text-secondary">
											<div class="avatar online">
												<div class="w-16 rounded-full">
													<img src="https://placeimg.com/128/128/people" />
												</div>
											</div>
										</div>
										<div class="stat-value">86%</div>
										<div class="stat-title">Tasks done</div>
										<div class="stat-desc text-secondary">31 tasks remaining</div>
									</div>
								</div>
							</div>
							<div class="flex-auto h-full" class:hidden={activeTab != 1}>
								<SectionTable />
							</div>
							<div class="flex-auto h-full" class:hidden={activeTab != 2}>
								<ListSubscribe />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

{#if showDrawer}
	<DrawerEditProfile bind:profileData bind:showDrawer />
{/if}

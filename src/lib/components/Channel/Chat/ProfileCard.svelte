<script lang="ts">
	import { page } from '$app/stores'
	import { get, post } from '$lib/api'
	import { onMount } from 'svelte'
	import { setProfile, getProfile } from '$lib/temp-store'
	import { clickOutside } from '$lib/utils.js'

	export let userId: string
	let profileData: any = getProfile(userId) || { profile: {} }
	let loading = false
	let show = false
	let elt:any

	const toggle = async() => {
		show = !show
		if(show)loadProfile(false)
	}

	const handleClickOutside = (event: any) => {
		show = false
	}

	const doSubscribe = async() => {
		loading = true
		const resp = await post('subscribe', {
			source1: profileData.profile._id,
			source2: $page.data.user?.userId,
			isSubscriber: true
		})
		loadProfile(true)
		loading = false
	}

	const loadProfile = async(refresh: boolean) => {
		loading = true
		if(getProfile(userId) && !refresh){
			profileData = getProfile(userId)
			console.log("profile loaded from local")
		}
		else{
			profileData.profile = await get(`users/search/id?userId=${userId}`)
			profileData.subscriberCount = await get(`subscribes/count?source=${userId}&sourceType=source1`)
			profileData.interestCount = await get(`subscribes/count?source=${userId}&sourceType=source2`)
			if ($page.data.user?.userId) {
				profileData.isSubscribed = await get(`subscribes/relationship?source=${profile._id}`, {
					userId: $page.data.user?.userId,
					token: $page.data.user?.token
				})
			}

			setProfile(userId, profileData)
			console.log("profile loaded from server")

		}
		loading = false
	}

	$: profile = profileData.profile
	$: subscriberCount = profileData.subscriberCount || 0
	$: interestCount = profileData.interestCount || 0
	$: margin = (elt ? elt.getBoundingClientRect().height : 0) + 40
	$: isSelf = userId === $page.data.user?.userId

</script>
<span use:clickOutside={handleClickOutside}>
	{#if show}
		<div
			style="margin-top: {-margin}px"
			bind:this={elt}
			data-popover
			class="absolute -mt-2 z-50 dropdown-content text-sm font-light text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600">
			<div class="p-3">
				
				<div class="flex items-center justify-between mb-2">
					<span>
						<img class="w-10 h-10 rounded-full bg-base-100 mask mask-squircle" src={profileData.profile.avatar} alt={profileData.profile.avatar} />
					</span>
					<div>
						<button 
							on:click={doSubscribe}
							disabled={isSelf || loading } 
							type="button" 
							class="text-white bg-blue-700 hover:bg-blue-800 
							focus:ring-4 focus:ring-blue-300 font-medium rounded-lg 
							text-xs px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 
							focus:outline-none dark:focus:ring-blue-800"
						>
							{loading ? "Loading..." : !profileData.isSubscribed ? "Unsubscribe" : "Subscribe"}
						</button>
					</div>
					
					
				</div>
				
				<p class="text-base font-semibold leading-none text-gray-900">
					{profileData.profile.displayName || ""}
				</p>
				<p class="mb-3 text-sm font-normal">
					<span class="hover:underline">@{profileData.profile.username || ""}</span>
				</p>
				<p class="mb-4 text-sm font-light">
					{profileData.profile.bio || ""}
				</p>
				<ul class="flex text-sm font-light">
					<li class="mr-2">
						<span class="hover:underline">
							<a class="font-semibold">{subscriberCount}</a>
							<a>Subscribers</a>
						</span>
					</li>
					<li>
						<span class="hover:underline">
							<a class="font-semibold">{interestCount}</a>
							<a>Interests</a>
						</span>
					</li>
				</ul>
				<div class="rotate-45 bg-white w-4 h-4 absolute"/>
			</div>
			
		</div>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span class="cursor-pointer" on:click={toggle}>
		<slot/>
	</span>
	</span>

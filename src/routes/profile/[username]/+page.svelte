<script lang="ts">
	import DrawerEditProfile from '$lib/components/Profile/DrawerEditProfile.svelte'
	import TabSection from '$lib/components/Profile/TabSection.svelte'
	import TopSection from '$lib/components/Profile/TopSection.svelte'
	import UserDetails from '$lib/components/Profile/Elements/UserDetails.svelte'
	import WholePageSkeleton from '$lib/components/Profile/Elements/WholePageSkeleton.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	let showDrawer = false
</script>

{#if !data.profile}
	<WholePageSkeleton />
{:else}
	<div class="relative block h-[31rem]">
		<div
			class="absolute top-0 w-full h-full bg-center bg-cover"
			style="background-image: url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80');">
			<span id="blackOverlay" class="w-full h-full absolute opacity-50 bg-black" />
		</div>
	</div>
	<div class="relative py-16">
		<div class="container mx-auto px-4">
			<div
				class="relative flex flex-col min-w-0 break-words bg-base-100 w-full mb-6 shadow-xl rounded-lg -mt-64">
				<div class="px-6">
					<TopSection
						profile={data.profile}
						subscriberCount={data.lazy.subscriberCount}
						interestCount={data.lazy.interestCount}
						isSubscribed={data.lazy.isSubscribed}
						bind:showDrawer />
					<UserDetails profile={data.profile} />
					<TabSection
						channels={data.lazy.channels}
						subscribers={data.lazy.subscribers}
						interests={data.lazy.interests} />
				</div>
			</div>
		</div>
	</div>
	{#if showDrawer}
		<DrawerEditProfile profile={data.profile} bind:showDrawer />
	{/if}
{/if}

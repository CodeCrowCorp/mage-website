<script lang="ts">
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	import AvatarLoader from './Elements/AvatarLoader.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { subscriber_count, interest_count } from '$lib/stores/profileStore'
	import { enhance } from '$app/forms'
	import { post } from '$lib/api.js'

	export let profile: any,
		subscriberCount: Promise<any>,
		interestCount: Promise<any>,
		isSubscribed: Promise<any>,
		showDrawer = false

	let isSubscribing = false,
		isSubscriber: any

	let subValues: any = null

	$: currentUser = $page.data.user?.user

	const refreash = async () => {
		subValues = await isSubscribed
	}

	const doSubscribe = async () => {
		subValues = null
		const resp = await post('subscribe', {
			source1: profile._id,
			source2: $page.data.user?.userId,
			isSubscriber: true
		})
		refreash()
	}

	onMount(async () => {
		$subscriber_count = await subscriberCount
		$interest_count = await interestCount
		refreash()
	})
</script>

<div class="flex flex-wrap justify-center">
	<div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
		<div class="relative">
			{#if profile.avatar}
				<div class="w-32 h-32">
					<div class="avatar -top-16 {profile.isOnline ? 'online' : 'offline'}">
						<div
							class="mask {profile?.isPaidPlan
								? 'mask-hexagon'
								: 'mask-squircle'} h-auto align-middle max-w-150-px">
							<img src={profile.avatar} alt="" class="!w-32 !h-32" />
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
		<div class="py-6 px-3 justify-center flex md:justify-end gap-4">
			<form
				action="?/subscribe"
				method="post"
				use:enhance={({ data }) => {
					data.append('isSubscribing', isSubscribing.toString())
					data.append('source1', profile._id)
					data.append('source2', $page.data.user?.userId)
				}}>
				<div class="flex gap-4">
					<button disabled={!subValues} class="btn btn-secondary" on:click={doSubscribe}>
						{subValues?.isSubscriber ? 'Unsubscribe' : !subValues ? 'Loading...' : 'Subscribe'}
					</button>
					<!--TODO: open sponsor dialog-->
					<button class="btn btn-primary" formaction="?/sponsor" disabled>Sponsor</button>
				</div>
			</form>
			<div class="dropdown dropdown-end">
				<button
					class="btn btn-circle"
					tabindex="0"
					disabled={currentUser?.username !== $page.params.username}>
					<IconMore />
				</button>
				<ul tabindex="-1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
					<li>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<label for="edit-profile-drawer" on:click={() => (showDrawer = true)}>Edit</label>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="w-full lg:w-4/12 px-4 lg:order-1">
		<div class="flex justify-center py-4 lg:pt-4 pt-8">
			<div class="mr-4 p-3 text-center tooltip" data-tip="{$subscriber_count || 0} subscribers">
				<span class="text-xl font-bold block uppercase tracking-wide">{$subscriber_count || 0}</span
				><span class="text-sm">Subscribers</span>
			</div>
			<div class="mr-4 p-3 text-center tooltip" data-tip="{$interest_count || 0} interests">
				<span class="text-xl font-bold block uppercase tracking-wide">{$interest_count || 0}</span
				><span class="text-sm">Interests</span>
			</div>
			<div class="lg:mr-4 p-3 text-center tooltip" data-tip="coming soon...">
				<!--{profile.views || 0} unique profile views-->
				<span class="text-xl font-bold block uppercase tracking-wide">{profile.views || 0}</span
				><span class="text-sm">Views</span>
			</div>
		</div>
	</div>
</div>

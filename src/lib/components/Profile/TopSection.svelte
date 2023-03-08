<script lang="ts">
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	import AvatarLoader from './Elements/AvatarLoader.svelte'
	import { page } from '$app/stores'

	export let profile: any,
		showDrawer = false
	$: currentUser = $page.data?.user?.user
</script>

<div class="flex flex-wrap justify-center">
	<div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
		<div class="relative">
			{#if profile?.avatar}
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
		<div class="py-6 px-3 justify-center flex md:justify-end gap-4">
			<button class="btn btn-secondary">Subscribe</button>
			<button class="btn btn-primary" disabled>Sponsor</button>
			{#if currentUser.username === $page.params.customUsername}
				<div class="dropdown dropdown-end">
					<button class="btn btn-circle" tabindex="0">
						<IconMore />
					</button>
					<ul tabindex="-1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
						<li>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<label for="edit-profile-drawer" on:click={() => (showDrawer = true)}> Edit</label>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</div>
	<div class="w-full lg:w-4/12 px-4 lg:order-1">
		<div class="flex justify-center py-4 lg:pt-4 pt-8">
			<div class="mr-4 p-3 text-center tooltip" data-tip="22 subscribers">
				<span class="text-xl font-bold block uppercase tracking-wide">22</span><span class="text-sm"
					>Subscribers</span>
			</div>
			<div class="mr-4 p-3 text-center tooltip" data-tip="10 interests">
				<span class="text-xl font-bold block uppercase tracking-wide">10</span><span class="text-sm"
					>Interests</span>
			</div>
			<div class="lg:mr-4 p-3 text-center tooltip" data-tip="2045 unique profile views">
				<span class="text-xl font-bold block uppercase tracking-wide">2045</span><span
					class="text-sm">Views</span>
			</div>
		</div>
	</div>
</div>

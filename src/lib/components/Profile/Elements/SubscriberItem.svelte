<script lang="ts">
	import { page } from '$app/stores'
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	export let subscriberItem: any
</script>

<div class="flex flex-row gap-2 px-4 py-2 card bg-base-100 justify-between">
	<div class="flex">
		<div class="avatar">
			<div class="w-16 mask mask-squircle">
				<img src={subscriberItem.avatar} alt="" />
			</div>
		</div>

		<div class="flex flex-col justify-center pl-4 text-start">
			<p>{subscriberItem.displayName}</p>
			<p class="text-secondary">@{subscriberItem.username}</p>
		</div>
	</div>

	<div class="flex flex-row items-center gap-4">
		<form action="?/subscribe" method="post">
			<button
				class="btn btn-sm btn-secondary text-white"
				disabled={subscriberItem?._id === $page.data.user?.userId}
				>{subscriberItem.isSubscriber ? 'Subscribe' : 'Unsubscribe'}</button>
		</form>
		<div class="dropdown dropdown-end z-20">
			<button class="btn btn-circle" tabindex="0">
				<IconMore />
			</button>
			<ul tabindex="-1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
				<li>
					<a href="/profile/{subscriberItem.username}">Profile</a>
				</li>
			</ul>
		</div>
	</div>
</div>

<script lang="ts">
	import SubscriberItem from '$lib/components/Profile/Elements/SubscriberItem.svelte'
	import { subscriber_count, interest_count } from '$lib/stores/profileStore'
	import { get } from '$lib/api.js'
	import LoadMoreContaier from "./LoadMore.svelte"
	import { page } from '$app/stores'

	export let profileId: string

	const searchSubscribers = async(query:string, skip:number, limit:number) => {
		return await get(`subscribes?source=${profileId}&sourceType=source1&searchQuery=${query}&skip=${skip}&limit=${limit}`)
	}

	const searchInterests = async(query:string, skip:number, limit:number) => {
		return await get(`subscribes?source=${profileId}&sourceType=source2&searchQuery=${query}&skip=${skip}&limit=${limit}`)
	}

	const getSubscribers = async(skip:number, limit:number) => {
		return await get(`subscribes?source=${profileId}&sourceType=source1&skip=${skip}&limit=${limit}`,{
		 	userId: $page?.data?.user?.userId, token: $page?.data?.user?.token 
		})
	}

	const getInterests = async(skip:number, limit:number) => {
		return await get(`subscribes?source=${profileId}&sourceType=source2&skip=${skip}&limit=${limit}`,{
		 	userId: $page?.data?.user?.userId, token: $page?.data?.user?.token 
		})
	}

</script>

<div class="flex flex-row justify-center gap-5 mt-8">
	<div class="card flex flex-col w-1/2 gap-2 bg-base-200 py-4 px-8">
		<p class="text-start font-semibold">Subscribers ({$subscriber_count})</p>
			
			<LoadMoreContaier 
				let:list 
				dataSource={getSubscribers}
				searchDataSource={searchSubscribers}
				inputPlaceholder="Search subscribers"
			>
				{#each list as subscriberItem}
					<SubscriberItem {subscriberItem} />
				{/each}
			</LoadMoreContaier>
			
	</div>
	<div class="card flex flex-col w-1/2 gap-2 bg-base-200 py-4 px-8">
		<p class="text-start font-semibold">Interests ({$interest_count})</p>
			
			<LoadMoreContaier 
				let:list 
				dataSource={getInterests}
				searchDataSource={searchInterests}
				inputPlaceholder="Search interests"
			>
				{#each list as subscriberItem}
					<SubscriberItem {subscriberItem} />
				{/each}
			</LoadMoreContaier>
		
	</div>
</div>

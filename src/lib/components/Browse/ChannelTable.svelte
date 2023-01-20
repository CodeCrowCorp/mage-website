<script lang="ts">
	import IconLock from '$lib/assets/icons/IconLock.svelte'
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'

	export let channels: any = undefined
</script>

<div class="overflow-x-auto w-full">
	<table class="table table-zebra w-full">
		<!-- head -->
		<thead>
			<tr>
				<th>Host</th>
				<th>Title</th>
				<th>Viewers</th>
				<th>Tag</th>
				<th>Category</th>
			</tr>
		</thead>
		<tbody>
			<!-- row 1 -->
			{#if channels && channels.length}
				{#each channels as channel}
					<tr class="cursor-pointer">
						<td>
							<div class="flex items-center space-x-3">
								<div class="avatar">
									<div class="w-12 rounded-full">
										<img src={channel.avatar} alt="" />
									</div>
								</div>
								<div>
									<div class="font-bold">{channel.createdBy}</div>
									<div class="text-sm text-pink-500">@GaganSuie</div>
								</div>
							</div>
						</td>
						<td>
							{channel.title}
							<br />
							<span class="text-sm">{channel.description}</span>
						</td>
						<td>
							<div class="flex gap-2">
								<IconLock />
								<IconViewers />
								<span>205</span>
							</div>
						</td>
						<td>
							<div class="flex flex-wrap gap-2 max-w-fit">
								{#if channel.tags && channel.tags.length}
									{#each channel.tags as tag}
										<div><span class="badge badge-primary badge-md">{tag}</span></div>
										<!-- <div><span class="badge badge-primary badge-md">Gameplay</span></div>
								<div><span class="badge badge-primary badge-md">Multiplayer</span></div> -->
									{/each}
								{/if}
							</div>
						</td>
						<td>
							<div class="flex">
								<img src="/category/games/call-of-duty-black-ops-4.svg" />
								<img src="/category/games/fortnite.svg" />
								<img src="/category/games/overwatch.svg" />
								<img src="/category/games/valorant.svg" />
							</div>
						</td>
					</tr>
				{/each}
			{:else}
				<!-- Skeleton Loader -->
				<tr>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
				</tr>
			{/if}
		</tbody>
		<!-- foot -->
		<tfoot>
			<tr>
				<th>Host</th>
				<th>Title</th>
				<th>Viewers</th>
				<th>Tags</th>
				<th>Category</th>
			</tr>
		</tfoot>
	</table>
</div>

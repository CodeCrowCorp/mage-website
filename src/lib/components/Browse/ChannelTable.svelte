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
									<div class="mask mask-squircle w-12 h-12">
										<img src={channel.avater} alt="" />
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
				<tr>
					<td>
						<div role="status" class="animate-pulse">
							<div class="h-40 bg-gray-200 dark:bg-gray-700 w-[200px] mb-4" />
						</div>
					</td>
					<td>
						<div role="status" class="animate-pulse">
							<div class="h-40 bg-gray-200 dark:bg-gray-700 w-[200px] mb-4" />
						</div>
					</td>
					<td>
						<div role="status" class="gap-6 animate-pulse">
							<div class="h-40 bg-gray-200 dark:bg-gray-700 w-[200px] mb-4" />
						</div>
					</td>
					<td>
						<div role="status" class="animate-pulse">
							<div class="h-40 bg-gray-200 dark:bg-gray-700 w-[200px] mb-4" />
						</div>
					</td>
				</tr>
			{/if}
			<!-- row 2 -->
			<!-- <tr class="cursor-pointer">
				<td>
					<div class="flex items-center space-x-3">
						<div class="avatar">
							<div class="mask mask-squircle w-12 h-12">
								<img
									src="https://placeimg.com/192/192/people"
									alt="Avatar Tailwind CSS Component" />
							</div>
						</div>
						<div>
							<div class="font-bold">Brice Swyre</div>
							<div class="text-sm opacity-50">China</div>
						</div>
					</div>
				</td>
				<td>
					Carroll Group
					<br />
					<span class="badge badge-ghost badge-sm">Tax Accountant</span>
				</td>
				<td>
					<button class="btn btn-ghost btn-xs">details</button>
				</td>
				<td>
					<button class="btn btn-ghost btn-xs">details</button>
				</td>
				<td>
					<button class="btn btn-ghost btn-xs">details</button>
				</td>
			</tr> -->
			<!-- row 3 -->
			<!-- <tr class="cursor-pointer">
				<td>
					<div class="flex items-center space-x-3">
						<div class="avatar">
							<div class="mask mask-squircle w-12 h-12">
								<img
									src="https://placeimg.com/192/192/people"
									alt="Avatar Tailwind CSS Component" />
							</div>
						</div>
						<div>
							<div class="font-bold">Marjy Ferencz</div>
							<div class="text-sm opacity-50">Russia</div>
						</div>
					</div>
				</td>
				<td>
					Rowe-Schoen
					<br />
					<span class="badge badge-ghost badge-sm">Office Assistant I</span>
				</td>
				<td>
					<button class="btn btn-ghost btn-xs">details</button>
				</td>
				<td>
					<button class="btn btn-ghost btn-xs">details</button>
				</td>
				<td>
					<button class="btn btn-ghost btn-xs">details</button>
				</td>
			</tr> -->
			<!-- row 4 -->
			<!-- <tr class="cursor-pointer">
				<td>
					<div class="flex items-center space-x-3">
						<div class="avatar">
							<div class="mask mask-squircle w-12 h-12">
								<img
									src="https://placeimg.com/192/192/people"
									alt="Avatar Tailwind CSS Component" />
							</div>
						</div>
						<div>
							<div class="font-bold">Yancy Tear</div>
							<div class="text-sm opacity-50">Brazil</div>
						</div>
					</div>
				</td>
				<td>
					Wyman-Ledner
					<br />
					<span class="badge badge-primary badge-md">Community Outreach Specialist</span>
				</td>
				<td>
					<button class="btn btn-ghost btn-xs">details</button>
				</td>
				<td>
					<button class="btn btn-ghost btn-xs">details</button>
				</td>
				<td>
					<button class="btn btn-ghost btn-xs">details</button>
				</td>
			</tr> -->
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

<script>
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import IconLock from '$lib/assets/icons/IconLock.svelte'
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import ChannelGroup from '$lib/components/Browse/ChannelGroup.svelte'
</script>

<div class="flex gap-4 py-5 pl-5">
	<div class="form-control">
		<div class="input-group">
			<input
				type="text"
				placeholder="Search channels"
				class="input input-bordered input-primary w-72" />
			<button class="btn btn-square">
				<IconSearch />
			</button>
		</div>
	</div>

	<button class="btn btn-wide btn-primary gap-2">
		<IconCreate />
		Create a channel</button>
</div>

<ChannelGroup title="Daily category" />

<ChannelGroup title="Most active" />

<ChannelGroup title="Top streamers" />

<ChannelGroup title="Rising stars" />

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
			<tr class="cursor-pointer">
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
							<div class="font-bold">Gagan Suie</div>
							<div class="text-sm text-pink-500">@GaganSuie</div>
						</div>
					</div>
				</td>
				<td>
					Fornite gameplay
					<br />
					<span class="text-sm">Testing new gameplay screen sharing</span>
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
						<div><span class="badge badge-primary badge-md">Community</span></div>
						<div><span class="badge badge-primary badge-md">Gameplay</span></div>
						<div><span class="badge badge-primary badge-md">Multiplayer</span></div>
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
			<!-- row 2 -->
			<tr class="cursor-pointer">
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
			</tr>
			<!-- row 3 -->
			<tr class="cursor-pointer">
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
			</tr>
			<!-- row 4 -->
			<tr class="cursor-pointer">
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
			</tr>
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

<script>
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
</script>

<div class="flex gap-4 py-5 ">
	<div class="form-control">
		<div class="input-group">
			<input type="text" placeholder="Search channels" class="input input-bordered input-primary" />
			<button class="btn btn-square">
				<IconSearch />
			</button>
		</div>
	</div>

	<button class="btn btn-wide btn-primary gap-2">
		<IconCreate />
		Create a channel</button>
</div>

<div class="overflow-x-auto w-full">
	<table class="table table-zebra w-full">
		<!-- head -->
		<thead>
			<tr>
				<th>Category</th>
				<th>Title</th>
				<th>Description</th>
				<th>Info</th>
				<th>Tag</th>
				<th>Host</th>
			</tr>
		</thead>
		<tbody>
			<!-- row 1 -->
			<tr>
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
							<div class="font-bold">Hart Hagerty</div>
							<div class="text-sm opacity-50">United States</div>
						</div>
					</div>
				</td>
				<td>
					Zemlak, Daniel and Leannon
					<br />
					<span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
				</td>
				<td>Purple</td>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
			</tr>
			<!-- row 2 -->
			<tr>
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
				<td>Red</td>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
			</tr>
			<!-- row 3 -->
			<tr>
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
				<td>Crimson</td>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
			</tr>
			<!-- row 4 -->
			<tr>
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
					<span class="badge badge-ghost badge-sm">Community Outreach Specialist</span>
				</td>
				<td>Indigo</td>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
				<th>
					<button class="btn btn-ghost btn-xs">details</button>
				</th>
			</tr>
		</tbody>
		<!-- foot -->
		<tfoot>
			<tr>
				<th>Category</th>
				<th>Title</th>
				<th>Description</th>
				<th>Info</th>
				<th>Tags</th>
				<th>Host</th>
			</tr>
		</tfoot>
	</table>
</div>

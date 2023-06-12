<script>
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
</script>

<div class="relative overflow-x-auto p-10">
	<div class="pb-4">
		<div class="form-control">
			<div class="input-group">
				<input
					type="text"
					placeholder="Search admins"
					class="input input-bordered input-primary w-80" />
				<button class="btn btn-square btn-neutral text-white">
					<IconSearch />
				</button>
			</div>
		</div>
	</div>
	<table class="table table-zebra w-full text-sm text-left text-gray-500 dark:text-gray-400">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="px-6 py-3"> Avatar </th>
				<th scope="col" class="px-6 py-3"> Display Name </th>
				<th scope="col" class="px-6 py-3"> Tag Name </th>
				<th scope="col" class="px-6 py-3"> Role </th>
				<th scope="col" class="px-6 py-3"> Action </th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th
					scope="row"
					class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					Apple MacBook Pro 17"
				</th>
				<td class="px-6 py-4"> Sliver </td>
				<td class="px-6 py-4"> Laptop </td>
				<td class="px-6 py-4"> $2999 </td>
				<td class="px-6 py-4">
					<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
				</td>
			</tr>
			<tr>
				<th
					scope="row"
					class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					Microsoft Surface Pro
				</th>
				<td class="px-6 py-4"> White </td>
				<td class="px-6 py-4"> Laptop PC </td>
				<td class="px-6 py-4"> $1999 </td>
				<td class="px-6 py-4">
					<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
				</td>
			</tr>
			<tr>
				<th
					scope="row"
					class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					Magic Mouse 2
				</th>
				<td class="px-6 py-4"> Black </td>
				<td class="px-6 py-4"> Accessories </td>
				<td class="px-6 py-4"> $99 </td>
				<td class="px-6 py-4">
					<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
				</td>
			</tr>
			<tr>
				<th
					scope="row"
					class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					Apple Watch
				</th>
				<td class="px-6 py-4"> Silver </td>
				<td class="px-6 py-4"> Accessories </td>
				<td class="px-6 py-4"> $179 </td>
				<td class="px-6 py-4">
					<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
				</td>
			</tr>
			<tr>
				<th
					scope="row"
					class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					iPad
				</th>
				<td class="px-6 py-4"> Gold </td>
				<td class="px-6 py-4"> Tablet </td>
				<td class="px-6 py-4"> $699 </td>
				<td class="px-6 py-4">
					<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
				</td>
			</tr>
			<tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
				<th
					scope="row"
					class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					Apple iMac 27"
				</th>
				<td class="px-6 py-4"> Silver </td>
				<td class="px-6 py-4"> PC Desktop </td>
				<td class="px-6 py-4"> $3999 </td>
				<td class="px-6 py-4">
					<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
				</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<th scope="col" class="px-6 py-3"> Avatar </th>
				<th scope="col" class="px-6 py-3"> Display Name </th>
				<th scope="col" class="px-6 py-3"> Tag Name </th>
				<th scope="col" class="px-6 py-3"> Role </th>
				<th scope="col" class="px-6 py-3"> Action </th>
			</tr>
		</tfoot>
	</table>

	<nav class="flex items-center justify-between pt-4" aria-label="Table navigation">
		<span class="text-sm font-normal text-gray-500 dark:text-gray-400"
			>Showing <span class="font-semibold text-gray-900 dark:text-white">1-10</span> of
			<span class="font-semibold text-gray-900 dark:text-white">1000</span></span>
		<ul class="inline-flex items-center -space-x-px">
			<li>
				<a
					href="#"
					class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
					<span class="sr-only">Previous</span>
					<svg
						class="w-5 h-5"
						aria-hidden="true"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
							clip-rule="evenodd" /></svg>
				</a>
			</li>
			<li>
				<a
					href="#"
					class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					>1</a>
			</li>
			<li>
				<a
					href="#"
					class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					>2</a>
			</li>
			<li>
				<a
					href="#"
					aria-current="page"
					class="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
					>3</a>
			</li>
			<li>
				<a
					href="#"
					class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					>...</a>
			</li>
			<li>
				<a
					href="#"
					class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					>100</a>
			</li>
			<li>
				<a
					href="#"
					class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
					<span class="sr-only">Next</span>
					<svg
						class="w-5 h-5"
						aria-hidden="true"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd" /></svg>
				</a>
			</li>
		</ul>
	</nav>
</div>

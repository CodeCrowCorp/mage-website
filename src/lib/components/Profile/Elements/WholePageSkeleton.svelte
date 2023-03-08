<script lang="ts">
	import AvatarLoader from '$lib/components/Profile/Elements/AvatarLoader.svelte'
	import CategoryLoader from '$lib/components/Profile/Elements/CategoryLoader.svelte'
	import NameLoader from '$lib/components/Profile/Elements/NameLoader.svelte'
</script>

<div class="relative block h-[31rem]">
	<div
		role="status"
		class="absolute animate-pulse top-0 w-full h-full bg-gray-100 dark:bg-gray-600" />
</div>
<div class="relative py-16">
	<div class="container mx-auto px-4">
		<div
			class="relative flex flex-col min-w-0 break-words bg-base-100 w-full mb-6 shadow-xl rounded-lg -mt-64">
			<div class="px-6">
				<div class="flex flex-wrap justify-center">
					<div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
						<div class="relative">
							<AvatarLoader />
						</div>
					</div>
					<div class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
						<div class="py-6 px-3 justify-center flex md:justify-end gap-4">
							<NameLoader />
							<NameLoader />
						</div>
					</div>
					<div class="w-full lg:w-4/12 px-4 lg:order-1">
						<div class="flex flex-row justify-center py-4 lg:pt-4 pt-8">
							<div class="flex flex-row gap-5">
								<div class="flex flex-col gap-2 items-center">
									<div
										role="status"
										class="flex w-10 h-8 bg-gray-300 rounded-sm dark:bg-gray-700 animate-pulse">
										<span class="sr-only">Loading...</span>
									</div>

									<div
										role="status"
										class="flex w-24 h-5 bg-gray-300 rounded-sm dark:bg-gray-700 animate-pulse">
										<span class="sr-only">Loading...</span>
									</div>
								</div>
								<div class="flex flex-col gap-2 items-center">
									<div
										role="status"
										class="flex w-10 h-8 bg-gray-300 rounded-sm dark:bg-gray-700 animate-pulse">
										<span class="sr-only">Loading...</span>
									</div>

									<div
										role="status"
										class="flex w-24 h-5 bg-gray-300 rounded-sm dark:bg-gray-700 animate-pulse">
										<span class="sr-only">Loading...</span>
									</div>
								</div>
								<div class="flex flex-col gap-2 items-center">
									<div
										role="status"
										class="flex w-10 h-8 bg-gray-300 rounded-sm dark:bg-gray-700 animate-pulse">
										<span class="sr-only">Loading...</span>
									</div>

									<div
										role="status"
										class="flex w-24 h-5 bg-gray-300 rounded-sm dark:bg-gray-700 animate-pulse">
										<span class="sr-only">Loading...</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="text-center flex flex-col items-center">
					<NameLoader />
					<NameLoader />

					<div class="pt-4">
						<div class="flex gap-2 justify-center">
							<CategoryLoader />
						</div>
					</div>
				</div>

				<div class="mt-10 py-10 border-t border-blue-200 text-center">
					<div class="flex flex-wrap justify-center">
						<div class="w-full px-4">
							<div class="tabs-boxed flex justify-center flex-row gap-2 bg-base-100">
								<div
									role="status"
									class="w-12 h-7 bg-gray-100 dark:bg-gray-600 animate-pulse rounded-sm">
									<span class="sr-only">Loading...</span>
								</div>
								<div
									role="status"
									class="w-12 h-7 bg-gray-100 dark:bg-gray-600 animate-pulse rounded-sm">
									<span class="sr-only">Loading...</span>
								</div>
								<div
									role="status"
									class="w-12 h-7 bg-gray-100 dark:bg-gray-600 animate-pulse rounded-sm">
									<span class="sr-only">Loading...</span>
								</div>
							</div>
							<div class="grid h-full bg-base-100 py-10">
								<div
									role="status"
									class="flex w-full h-24 bg-gray-300 rounded-md dark:bg-gray-700 animate-pulse">
									<span class="sr-only">Loading...</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

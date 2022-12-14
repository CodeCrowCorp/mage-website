<script lang="ts">
	import PartnerList from '$lib/components/LandingPage/Partnerships/PartnerList.svelte';

	import partnershipTitle from '$lib/assets/images/partnerships-title.svg';
</script>

<div
	class="relative bg-partnerships bg-cover bg-no-repeat bg-right w-full bg-[#19191D] overflow-hidden mt-[-115px]"
>
	<div
		class="container relative space-y-20 mb-20 sm:space-y-24 sm:my-24 lg:space-y-32 lg:my-32 ml-auto mr-auto"
	>
		<div
			class="relative flex flex-col sm:flex-row sm:items-end justify-between mb-12 lg:mb-14 pt-6"
		>
			<div class="flex flex-col items-center text-center w-full max-w-2xl mx-auto">
				<img
					src={partnershipTitle}
					alt=""
					class="flex items-center flex-wrap justify-center h-[62px]"
				/>
			</div>
		</div>

		<div class="relative pb-10 pt-10">
			<div
				class="flex flex-col lg:flex-row space-y-14 lg:space-y-0 lg:space-x-10 lg:items-center relative"
			>
				<PartnerList />
			</div>
		</div>
	</div>
</div>

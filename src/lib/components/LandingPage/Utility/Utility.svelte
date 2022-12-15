<script lang="ts">
	import BenefitList from '$lib/components/LandingPage/Utility/BenefitList.svelte';

	import utilityTitle from '$lib/assets/images/utility-title.svg';
</script>

<div
	class="relative bg-utility bg-cover bg-no-repeat bg-top clip-path-utilitypolygon w-full bg-[#25252A] overflow-hidden mt-[-115px] z-50"
>
	<div
		class="container relative space-y-20 mb-20 sm:space-y-24 sm:my-24 lg:space-y-32 lg:my-32 ml-auto mr-auto"
	>
		<div class="relative flex flex-col sm:flex-row sm:items-end justify-between mb-12 lg:mb-14">
			<div class="flex flex-col items-center text-center w-full max-w-2xl mx-auto">
				<img
					src={utilityTitle}
					alt=""
					class="flex items-center flex-wrap justify-center h-[62px]"
				/>
			</div>
		</div>
		<div class="relative pb-10">
			<div
				class="flex flex-col lg:flex-row space-y-14 lg:space-y-0 lg:space-x-10 lg:items-center relative"
			>
				<BenefitList />
			</div>
		</div>
	</div>
</div>

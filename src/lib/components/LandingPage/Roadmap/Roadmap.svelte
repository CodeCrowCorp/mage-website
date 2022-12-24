<script lang="ts">
	import roadmapTitle from '$lib/assets/images/roadmap-title.svg';

	import Phases from '$lib/components/LandingPage/Roadmap/Phases.svelte';
</script>

<div class="relative bg-roadmap bg-cover bg-no-repeat bg-right w-full bg-[#EEEEEE] overflow-hidden">
	<div
		class="container relative space-y-20 mb-20 sm:space-y-24 sm:my-24 lg:space-y-32 lg:my-32 ml-auto mr-auto"
	>
		<div class="relative flex flex-col sm:flex-row sm:items-end justify-between mb-12 lg:mb-14">
			<div class="flex flex-col items-center text-center w-full max-w-2xl mx-auto">
				<img
					src={roadmapTitle}
					alt=""
					class="flex items-center flex-wrap justify-center h-[62px]"
				/>
			</div>
		</div>
		<div class="relative pb-10 px-12 pt-24">
			<div
				class="flex flex-col lg:flex-row space-y-14 lg:space-y-0 lg:space-x-10 lg:items-center relative"
			>
				<ul
					class="relative w-full before:absolute before:bg-[#DADADA] before:rounded-[20px] before:content-[''] before:w-1 before:h-[1600px] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:top-[710px]"
				>
					<Phases />
				</ul>
			</div>
		</div>
	</div>
</div>

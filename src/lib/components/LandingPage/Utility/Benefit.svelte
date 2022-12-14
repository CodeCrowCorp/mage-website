<script lang="ts">
	export let name: string, image: string, summary: string;
</script>

<div class="relative flex flex-col text-center items-center">
	<div class="relative flex-shrink-0 items-center">
		<div class="flex h-full w-full flex-shrink-0">
			<img src={image} class="object-cover w-20" alt="team-avatar" />
		</div>
	</div>
	<div class="pb-10 px-10 pt-1.5">
		<div class="mt-5 items-center text-center justify-between">
			<h2 class="text-white text-base font-semibold items-center text-center uppercase">
				{name}
			</h2>
			<span class="block mt-5 font-normal text-sm items-center text-center text-white">
				{summary}
			</span>
		</div>
	</div>
</div>

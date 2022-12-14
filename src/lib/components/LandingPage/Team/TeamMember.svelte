<script lang="ts">
	export let name: string, position: string, avatar: string;
</script>

<div
	class="relative flex flex-col overflow-hidden rounded-[10px] bg-[#00000040] h-[375px] py-14 px-20"
>
	<div class="relative flex-shrink-0">
		<div class="flex h-full w-full flex-shrink-0 rounded-3xl overflow-hidden">
			<img src={avatar} class="object-cover w-full h-full" alt="team-avatar" />
		</div>
	</div>
	<div class="pb-5 px-4 pt-1.5">
		<div class="mt-5 items-center text-center justify-between">
			<h2 class="text-white text-base font-semibold items-center text-center uppercase">
				{name}
			</h2>
			<span class="block mt-2.5 font-normal text-sm items-center text-center text-white"
				>{position}
			</span>
		</div>
	</div>
</div>

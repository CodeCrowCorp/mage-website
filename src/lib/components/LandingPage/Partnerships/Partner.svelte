<script lang="ts">
	export let avatar: string, link: string;
</script>

<a
	href={link}
	class="relative flex flex-col overflow-hidden rounded bg-[#BABABB] drop-shadow-sm h-24 py-5 px-5 align-middle text-center justify-center"
>
	<div class="relative flex-shrink-0 align-middle text-center justify-center">
		<div class="flex h-full w-full flex-shrink-0 overflow-hidden">
			<img src={avatar} class="object-cover w-full h-full" alt="team-avatar" />
		</div>
	</div>
</a>

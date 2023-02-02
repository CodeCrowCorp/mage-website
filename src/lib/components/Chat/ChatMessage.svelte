<script lang="ts">
	export let sender: any
</script>

<div class="menu">
	<ul>
		<li>
			{#if sender.username == 'Gagan'}
				<!--Host-->

				<div class="p-1 border border-transparent rounded-lg flex gap-2 w-96">
					<span>
						<span class="bg-secondary rounded-sm text-sm px-[5px] py-[2px] text-white">Host</span>
						<span class="cursor-pointer text-pink-500 font-medium">@{sender.username}</span>
						<span>{sender.message}</span>
					</span>
				</div>
			{:else if sender.username == 'Singh'}
				<!--You-->
				<div class="p-1 border border-transparent rounded-lg flex flex-row-reverse gap-2 w-96">
					<span>
						<span>{sender.message}</span>
						<span class="cursor-pointer font-medium">@{sender.username}</span>
						<span class="bg-gray-600 rounded-sm text-sm px-[5px] py-[2px] text-white">You</span>
					</span>
				</div>
			{:else if sender.username == 'Moderator'}
				<!--Mod-->
				<div class="p-1 border border-transparent rounded-lg flex gap-2 w-96">
					<span>
						<span class="bg-green-700 rounded-sm text-sm px-[5px] py-[2px] text-white">Mod</span>
						<span class="cursor-pointer text-success font-medium">@{sender.username}</span>
						<span>{sender.message}</span>
					</span>
				</div>
			{:else}
				<!--Rando-->
				<div class="p-1 border border-transparent rounded-lg flex gap-2 w-96">
					<span>
						<span class="cursor-pointer text-info font-medium">@{sender.username}</span>
						<span>{sender.message}</span>
					</span>
				</div>
			{/if}
		</li>
	</ul>
</div>

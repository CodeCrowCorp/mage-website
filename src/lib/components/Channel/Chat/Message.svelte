<script lang="ts">
	import IconChatHorizontalMore from '$lib/assets/icons/chat/IconChatHorizontalMore.svelte'
	import ProfileCard from '$lib/components/Channel/Chat/ProfileCard.svelte'

	export let sender: any
	let coloredRoles: { tagColor?: any; textColor?: string } = {}

	switch (sender.role) {
		case 'Host':
			coloredRoles = {
				tagColor: 'bg-secondary',
				textColor: 'text-pink-500'
			}
			break
		case 'You':
			coloredRoles = {
				tagColor: 'bg-gray-600'
			}
			break
		case 'Mod':
			coloredRoles = {
				tagColor: 'bg-green-700',
				textColor: 'text-success'
			}
			break
		case 'Rando':
			coloredRoles = {
				textColor: 'text-info'
			}
			break
	}
</script>

<!-- <ProfileCard /> -->

<div class="menu">
	<ul>
		<li class="group relative dropdown">
			{#if sender.role === 'You'}
				<!--You-->
				<div class="p-1 border border-transparent rounded-lg flex flex-row-reverse gap-2 w-96">
					<span>
						<span class="break-words">{sender.message}</span>
						<span class="font-medium">@{sender.userData?.username}</span>
						<span class="{coloredRoles?.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
							>{sender.role}</span>
					</span>
					<div class="group-hover:block dropdown-menu absolute hidden left-0 cursor-pointer">
						<div class="rounded-lg bg-base-200 m-1 border-base-100 border-2">
							<IconChatHorizontalMore />
						</div>
					</div>
				</div>
			{:else}
				<!--Host, Mod, or Rando-->
				<div class="p-1 border border-transparent rounded-lg flex gap-2 w-96">
					<span>
						{#if sender.role === 'Host' || sender.role === 'Mod'}
							<span class="{coloredRoles?.tagColor} rounded-sm text-sm px-[5px] py-[2px] text-white"
								>{sender.role}</span>
						{/if}
						<span
							data-popover-target="popover-user-profile"
							class="{coloredRoles?.textColor} font-medium">@{sender.userData?.username}</span>
						<span class="break-words">{sender.message}</span>
						<div class="group-hover:block dropdown-menu absolute hidden right-0 cursor-pointer">
							<div class="rounded-lg bg-base-200 m-1 border-base-100 border-2">
								<IconChatHorizontalMore />
							</div>
						</div>
					</span>
				</div>
			{/if}
		</li>
	</ul>
</div>

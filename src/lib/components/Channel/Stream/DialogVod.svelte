<script lang="ts">
	import { patch } from '$lib/api'
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	import { is_vod_modal_open } from '$lib/stores/channelStore'
	import { timeSince } from '$lib/utils'

	export let vod: any

	const toggleVodVisibility = async () => {
		const updatedVod = await patch(`vod`, {
			channel: vod.channel,
			inputId: vod.inputId,
			isVisible: !vod.isVisible
		})
		vod.isVisible = updatedVod.isVisible
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="modal {$is_vod_modal_open ? 'modal-open' : ''}"
	on:click={() => {
		$is_vod_modal_open = false
		vod = null
	}}>
	<div
		class="modal-box w-11/12 h-full max-w-[1500px] overflow-hidden"
		on:click={(e) => {
			e.stopPropagation()
		}}>
		<form method="dialog">
			<div class="flex absolute right-2 top-2">
				<button class="btn btn-sm btn-circle btn-ghost">
					<IconMore />
				</button>
				<button
					class="btn btn-sm btn-circle btn-ghost"
					on:click={() => {
						$is_vod_modal_open = false
						vod = null
					}}>✕</button>
			</div>
		</form>
		<h3 class="font-bold text-lg">@{vod?.username}</h3>
		{timeSince(vod?.createdAt)}
		<iframe
			src={vod?.url}
			class="w-full h-full max-w-full max-h-full"
			allow="fullscreen"
			title="vod"></iframe>
	</div>
</div>

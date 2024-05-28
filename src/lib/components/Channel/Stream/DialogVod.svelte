<script lang="ts">
	import { is_vod_modal_open } from '$lib/stores/channelStore'
	import { getTimeFormat, timeSince } from '$lib/utils'

	export let vod: any
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
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				on:click={() => {
					$is_vod_modal_open = false
					vod = null
				}}>✕</button>
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

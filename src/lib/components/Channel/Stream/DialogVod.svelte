<script lang="ts">
	import { page } from '$app/stores'
	import { get, patch } from '$lib/api'
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	import { is_vod_modal_open } from '$lib/stores/channelStore'
	import { timeSince } from '$lib/utils'

	export let vod: any, isHost: boolean

	$: vodIsVisible = vod?.isVisible
	let downloadUrl = ''
	$: if (vod) {
		getDownloadUrl().then((url) => (downloadUrl = url))
	}

	const toggleVodVisibility = async () => {
		const updatedVod = await patch(
			`vod`,
			{
				channelId: vod.channelId,
				uid: vod.uid,
				inputId: vod.inputId,
				isVisible: !vod.isVisible
			},
			{ userId: $page.data.user?.userId, token: $page.data.user?.token }
		)
		vod.isVisible = updatedVod.isVisible
	}

	const getDownloadUrl = async () => {
		return await get(`vod/download-url?videoUid=${vod?.uid}&createdAt=${vod?.createdAt}`, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
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
				{#if isHost}
					<div class="dropdown-menu dropdown dropdown-end" tabindex="1">
						<button class="btn btn-sm btn-circle btn-ghost">
							<IconMore />
						</button>
						<ul
							tabindex="1"
							class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 z-10">
							<li>
								<a on:click={toggleVodVisibility}
									><input
										type="checkbox"
										class="toggle toggle-primary toggle-xs"
										bind:checked={vodIsVisible} />
									Visible to viewers</a>
							</li>
							<li><a href={downloadUrl} target="_blank">Download</a></li>
						</ul>
					</div>
				{/if}
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

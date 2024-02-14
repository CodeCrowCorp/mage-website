<script lang="ts">
	import { is_sponsor_dialog_open } from '$lib/stores/channelStore'
	import { is_feature_premium_enabled } from '$lib/stores/remoteConfigStore'

	export let userId: number
</script>

{#if $is_feature_premium_enabled}
	<dialog class={`modal ${$is_sponsor_dialog_open && 'modal-open'}`}>
		<div class="modal-box">
			<h3 class="font-bold text-lg">Hello!</h3>
			<p class="py-4">Press ESC key or click the button below to close</p>
			<div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn" on:click={() => ($is_sponsor_dialog_open = !$is_sponsor_dialog_open)}
						>Close</button>
				</form>
			</div>
		</div>
	</dialog>
{/if}

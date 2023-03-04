<script lang="ts">
	import IconShareScreen from '$lib/assets/icons/channel/IconShareScreen.svelte'
	import IconShareWebcam from '$lib/assets/icons/channel/IconShareWebcam.svelte'
	import IconShareAudio from '$lib/assets/icons/channel/IconShareAudio.svelte'
	import IconChatDrawer from '$lib/assets/icons/channel/IconChatDrawer.svelte'
	import { isChatDrawerOpen } from '$lib/stores/channelStore'
</script>

<div class="flex gap-4">
	<button class="btn">
		<IconShareScreen />
	</button>

	<button class="btn">
		<IconShareWebcam />
	</button>

	<button class="btn">
		<IconShareAudio />
	</button>

	<div class="form-control">
		<label for="chat-drawer" class="btn {$isChatDrawerOpen ? 'btn-primary' : ''}">
			<IconChatDrawer /></label>
	</div>
</div>

<!-- <button>
    <IconShareRaiseHand/>
</button> -->

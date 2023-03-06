<script lang="ts">
	import IconShareScreen from '$lib/assets/icons/channel/IconShareScreen.svelte'
	import IconShareWebcam from '$lib/assets/icons/channel/IconShareWebcam.svelte'
	import IconShareAudio from '$lib/assets/icons/channel/IconShareAudio.svelte'
	import IconChatDrawer from '$lib/assets/icons/channel/IconChatDrawer.svelte'
	import { isChatDrawerOpen } from '$lib/stores/channelStore'
	import { isSharingScreen, isSharingWebcam, isSharingAudio } from '$lib/stores/streamStore'

	export let isHost: boolean = true
</script>

<div class="flex gap-4">
	<button
		class="btn tooltip font-normal normal-case {$isSharingScreen ? 'btn-primary' : ''}"
		data-tip="Screen"
		on:click={() => ($isSharingScreen = !$isSharingScreen)}
		disabled={!isHost}>
		<IconShareScreen />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$isSharingWebcam ? 'btn-primary' : ''}"
		data-tip="Webcam"
		on:click={() => ($isSharingWebcam = !$isSharingWebcam)}
		disabled={!isHost}>
		<IconShareWebcam />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$isSharingAudio ? 'btn-primary' : ''}"
		data-tip="Audio"
		on:click={() => ($isSharingAudio = !$isSharingAudio)}
		disabled={!isHost}>
		<IconShareAudio />
	</button>

	<div class="form-control tooltip" data-tip="Chat">
		<label for="chat-drawer" class="btn {$isChatDrawerOpen ? 'btn-primary' : ''}">
			<IconChatDrawer /></label>
	</div>
</div>

<!-- <button>
    <IconShareRaiseHand/>
</button> -->

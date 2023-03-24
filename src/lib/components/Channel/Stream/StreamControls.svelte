<script lang="ts">
	import IconShareScreen from '$lib/assets/icons/channel/IconShareScreen.svelte'
	import IconShareWebcam from '$lib/assets/icons/channel/IconShareWebcam.svelte'
	import IconShareAudio from '$lib/assets/icons/channel/IconShareAudio.svelte'
	import IconChatDrawer from '$lib/assets/icons/channel/IconChatDrawer.svelte'
	import { is_chat_drawer_open, is_chat_drawer_destroy } from '$lib/stores/channelStore'
	import { is_sharing_screen, is_sharing_webcam, is_sharing_audio } from '$lib/stores/streamStore'

	export let isHost: boolean = true

	const handleChatDrawer = () => {
		if ($is_chat_drawer_open) {
			$is_chat_drawer_open = false
			setTimeout(() => {
				$is_chat_drawer_destroy = true
			}, 300)
			return
		}

		$is_chat_drawer_destroy = false
		setTimeout(() => {
			$is_chat_drawer_open = !$is_chat_drawer_open
		}, 100)
	}
</script>

<div class="flex gap-4">
	<button
		class="btn tooltip font-normal normal-case {$is_sharing_screen ? 'btn-primary' : ''}"
		data-tip="Screen"
		on:click={() => ($is_sharing_screen = !$is_sharing_screen)}
		disabled={!isHost}>
		<IconShareScreen />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$is_sharing_webcam ? 'btn-primary' : ''}"
		data-tip="Webcam"
		on:click={() => ($is_sharing_webcam = !$is_sharing_webcam)}
		disabled={!isHost}>
		<IconShareWebcam />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$is_sharing_audio ? 'btn-primary' : ''}"
		data-tip="Audio"
		on:click={() => ($is_sharing_audio = !$is_sharing_audio)}
		disabled={!isHost}>
		<IconShareAudio />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$is_chat_drawer_open ? 'btn-primary' : ''}"
		data-tip="Chat"
		on:click={() => handleChatDrawer()}>
		<IconChatDrawer />
	</button>
</div>

<!-- <button>
    <IconShareRaiseHand/>
</button> -->

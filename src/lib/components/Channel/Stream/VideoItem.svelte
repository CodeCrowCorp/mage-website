<script lang="ts">
	import WHEPClient from '$lib/WHEPClient'
	import WHIPClient from '$lib/WHIPClient'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	// import IconChatMod from '$lib/assets/icons/chat/IconChatMod.svelte'
	// import IconChatGuest from '$lib/assets/icons/chat/IconChatGuest.svelte'
	// import { emitChannelUpdate } from '$lib/websocket'
	// import { getColoredRole } from '$lib/utils'

	export let video: any, channel: any, sender: any

	let coloredRole: any = {},
		isGuest = false,
		screenElement: HTMLVideoElement,
		webcamElement: HTMLVideoElement,
		audioElement: HTMLVideoElement,
		screenWhip: WHIPClient,
		screenWhep: WHEPClient,
		webcamWhip: WHIPClient,
		webcamWhep: WHEPClient,
		audioWhip: WHIPClient,
		audioWhep: WHEPClient

	let wasCalled = false

	$: if (video.screen) {
		toggleClient({
			trackType: 'screen'
		})
		wasCalled = true
	}

	$: if (video.webcam) {
		toggleClient({
			trackType: 'webcam'
		})
	}

	$: if (video.audio) {
		toggleClient({
			trackType: 'audio'
		})
	}

	const toggleClient = ({ trackType }: { trackType: string }) => {
		if ($page.data.user.user.username === video.username) {
			switch (trackType) {
				case 'screen':
					if (wasCalled) return
					console.log('video.screen.webRTC.url', video.screen.webRTC.url)
					console.log('screenElement', screenElement)
					console.log('video.screen.trackType', video.screen.trackType)
					screenWhip = new WHIPClient(
						video.screen.webRTC.url,
						screenElement,
						video.screen.trackType
					)
					wasCalled = true
					break
				case 'webcam':
					webcamWhip = new WHIPClient(
						video.webcam.webRTC.url,
						webcamElement,
						video.webcam.trackType
					)
					break
				case 'audio':
					audioWhip = new WHIPClient(video.audio.webRTC.url, audioElement, video.audio.trackType)
					break
			}
		} else if ($page.data.user.user.username !== video.username) {
			switch (trackType) {
				case 'screen':
					screenWhep = new WHEPClient(video.screen.webRTCPlayback.url, screenElement)
					break
				case 'webcam':
					webcamWhep = new WHEPClient(video.webcam.webRTCPlayback.url, webcamElement)
					break
				case 'audio':
					audioWhep = new WHEPClient(video.audio.webRTCPlayback.url, audioElement)
					break
			}
		}
	}

	onMount(() => {
		// coloredRole = getColoredRole(sender.role)
		// isGuest = channel?.guests?.includes(sender.userData?.userId)
		screenElement = document.getElementById(`screen-${video._id}`) as HTMLVideoElement
		webcamElement = document.getElementById(`webcam-${video._id}`) as HTMLVideoElement
		audioElement = document.getElementById(`audio-${video._id}`) as HTMLVideoElement

		if (screenElement) {
			screenElement.addEventListener('dblclick', (event: any) => {
				if (document.fullscreenElement) {
					document.exitFullscreen()
				} else {
					screenElement.requestFullscreen()
				}
			})
			screenElement.addEventListener(
				'click',
				(event: { preventDefault: () => void; stopPropagation: () => void }) => {
					event.preventDefault()
					event.stopPropagation()
					screenElement.scrollIntoView()
				}
			)
		}
	})

	// const toggleMod = () => {
	// 	if (channel.mods.includes(sender.userData?.userId)) {
	// 		channel.mods = channel.mods.filter((mod: string) => mod !== sender.userData?.userId)
	// 	} else {
	// 		channel.mods.push(sender.userData?.userId)
	// 	}
	// 	emitChannelUpdate({ channel })
	// }

	// const toggleGuest = () => {
	// 	if (channel.guests.includes(sender.userData?.userId)) {
	// 		channel.guests = channel.guests.filter((guest: string) => guest !== sender.userData?.userId)
	// 	} else {
	// 		channel.guests.push(sender.userData?.userId)
	// 	}
	// 	emitChannelUpdate({ channel })
	// }
</script>

<div class="w-[500px]">
	<div class="bg-base-200 relative w-full h-full rounded-md">
		{#if !video.screen && !video.webcam}
			<div
				class="absolute w-24 md:w-24 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2 right-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<img src={video.avatar} alt="" />
			</div>
		{/if}
		<video id={`screen-${video._id}`} autoplay muted class="rounded-md" />

		<video
			id={`webcam-${video._id}`}
			autoplay
			muted
			class="rounded-md absolute bottom-0 right-0 w-1/2 h-1/2" />

		<video id={`audio-${video._id}`} autoplay muted class="rounded-md" />
		<div class="absolute left-2 bottom-2 rounded-md dropdown">
			<label tabindex="0" class="btn btn-sm normal-case">@{video.username}</label>
			<!-- <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
				<li>
					<a on:click={() => toggleMod()}
						><IconChatMod /> {sender?.role === 'Mod' ? 'Remove Mod' : 'Grant Mod'}
					</a>
				</li>
				<li>
					<a on:click={() => toggleGuest()}><IconChatGuest /> Revoke Guest </a>
				</li>
			</ul> -->
		</div>
	</div>
</div>

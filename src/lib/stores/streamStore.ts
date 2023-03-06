import { writable, type Writable } from 'svelte/store'
import { env } from '$env/dynamic/public'
// import { currentChannel } from '$lib/stores/channelStore'
import { emitRoomMemberUpdate, emitUserActions } from '$lib/websocket'

export const isSharingScreen: Writable<boolean> = writable(false)
export const isSharingWebcam: Writable<boolean> = writable(false)
export const isSharingAudio: Writable<boolean> = writable(false)

let videoStreamId = ''
let hasActiveTracks = false

const userData: {
	id: string
	avatar: any
	username: any
	displayName: string
	userType: string
	obsState: string
	screenState: string
	webcamState: string
	audioState: string
	isHandRaised: boolean
	obsStream: any
	screenStream: any
	webcamStream: any
	audioStream: any
} = {
	id: '',
	avatar: null,
	username: null,
	displayName: '',
	userType: 'listener',
	obsState: 'restricted',
	screenState: 'restricted',
	webcamState: 'restricted',
	audioState: 'restricted',
	isHandRaised: false,
	obsStream: null,
	screenStream: null,
	webcamStream: null,
	audioStream: null
}

let streamOptions: {
	isRecording: boolean
	isLiveStreaming: boolean
	isEveryoneSilenced: boolean
	duration: number
	hasWaitedOneSecondObs: boolean
	hasWaitedOneSecondScreen: boolean
	hasWaitedOneSecondWebcam: boolean
	hasWaitedOneSecondAudio: boolean
	hasWaitedOneSecondRecord: boolean
	hasWaitedOneSecondRaiseHand: boolean
	hasWaitedOneSecondSilence: boolean
	isTimedOut: boolean
	isMaxLimitReached: boolean
} = {
	isRecording: false,
	isLiveStreaming: false,
	isEveryoneSilenced: true,
	duration: 0,
	hasWaitedOneSecondObs: true,
	hasWaitedOneSecondScreen: true,
	hasWaitedOneSecondWebcam: true,
	hasWaitedOneSecondAudio: true,
	hasWaitedOneSecondRecord: true,
	hasWaitedOneSecondRaiseHand: true,
	hasWaitedOneSecondSilence: true,
	isTimedOut: false,
	isMaxLimitReached: false
}

export const roomMembers: Writable<[]> = writable([])
export const channelMembersCount: Writable<number> = writable(0)

async function getMembers({
	channelId,
	isParticipant,
	skip,
	limit
}: {
	channelId: string
	isParticipant: boolean
	skip: number
	limit: number
}) {
	return await fetch(
		`${env.PUBLIC_API_URL}/channel-members?channelId=${channelId}&isParticipant=${isParticipant}&skip=${skip}&limit=${limit}`,
		{
			method: 'GET'
		}
	).then((response) => response.json())
}

async function getChannelMembersCount({ channelId }: { channelId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/channel-members/count?channelId=${channelId}`, {
		method: 'GET'
	}).then((response) => response.json())
}

async function initRoomMembers() {
	//TODO: get currenChannel writeable
	// roomMembers = await getMembers({
	//     channelId: channelStore.currentChannel._id,
	//     isParticipant: true,
	//     skip: 0,
	//     limit: 10
	// })
	// channelMembersCount = await getChannelMembersCount({
	//     channelId: channelStore.currentChannel._id
	// })
	// Object.assign(userData, getMember(authService.currentUser))
	// const doesUserExist = roomMembers.some((member) => member.id == userData.id)
	// if (channelStore.currentChannel.user === userData.id && !doesUserExist) {
	//     roomMembers.push(userData)
	// }
	// socketStore.emitRoomMemberUpdate({
	//     channelId: channelStore.currentChannel._id,
	//     userData: userData,
	//     isNewUser: true
	// })
	// listenToRoomMemberUpdate()
	// listenToUserActions()
	// streamOptions.isEveryoneSilenced =
	//     channelStore.currentChannel.isEveryoneSilenced
	// if (channelStore.currentChannel.user === authService.currentUser._id) {
	//     await createLiveStream(
	//         channelStore.currentChannel._id,
	//         `${channelStore.currentChannel.title}-${channelStore.currentChannel.user}`
	//     )
	//     await channelStore.updateisLive({
	//         channelId: channelStore.currentChannel._id,
	//         isLive: true
	//     })
	// }
}

function listenToRoomMemberUpdate() {
	//TODO: fix subscribing to writeables
	// roomMembersSubscription = socketStore
	//     .listenToRoomMemberUpdate({
	//         channelId: channelStore.currentChannel._id
	//     })
	//     .subscribe(async (data) => {
	//         if (channelStore.currentChannel) {
	//             if (data.isNewUser) {
	//                 const doesUserExist = roomMembers.some(
	//                     (member) => member.id == data.userData.id
	//                 )
	//                 if (!doesUserExist && data.userData.userType != 'listener') {
	//                     roomMembers.push(data.userData)
	//                     if (userData.id == data.userData.id) {
	//                         userData = data.userData
	//                     }
	//                 }
	//             } else if (!data.isNewUser) {
	//                 const index = roomMembers.findIndex(
	//                     (item) => item.id == data.userData.id
	//                 )
	//                 if (index > -1) roomMembers.splice(index, 1)
	//                 if (userData.id == data.userData.id) {
	//                     userData = data.userData
	//                 }
	//             }
	//             if (data.userData.obsStream) attachTrack(data.userData.obsStream, data.userData.id, 'obs')
	//             if (data.userData.screenStream) attachTrack(data.userData.screenStream, data.userData.id, 'screen')
	//             if (data.userData.webcamStream) attachTrack(data.userData.webcamStream, data.userData.id, 'webcam')
	//             if (data.userData.audioStream) attachTrack(data.userData.audioStream, data.userData.id, 'audio')
	//             channelMembersCount = await getChannelMembersCount({
	//                 channelId: channelStore.currentChannel._id
	//             })
	//             console.log("channelMembersCount", channelMembersCount)
	//             channelStore.currentChannel.memberCount = channelMembersCount
	//         }
	//     })
}

function listenToUserActions() {
	//TODO: fix subscribing to writeables
	// userActionsSubscription = socketStore
	//     .listenToUserActions({
	//         channelId: channelStore.currentChannel._id
	//     })
	//     .subscribe(async (data) => {
	//         const messageData = JSON.parse(data.message)
	//         let member = roomMembers.find((member) => member.id == messageData.userId)
	//         if (!member) member = data.userData
	//         switch (messageData.type) {
	//             case 'toggleTrack':
	//                 if (messageData.trackType === 'obs') { member.obsState === 'live' ? attachTrack(member.obsStream, data.userData.id, 'obs') : detachTrack(member.id, 'obs') }
	//                 if (messageData.trackType === 'screen' && userData.id !== member.id) {
	//                     member.screenState === 'live' ? attachTrack(member.screenStream, member.id, 'screen') : detachTrack(member.id, 'screen')
	//                 }
	//                 if (messageData.trackType === 'webcam' && userData.id !== member.id) { member.webcamState === 'live' ? attachTrack(member.webcamStream, member.id, 'webcam') : detachTrack(member.id, 'webcam') }
	//                 if (messageData.trackType === 'audio' && userData.id !== member.id) { member.audioState === 'live' ? attachTrack(member.audioStream, member.id, 'audio') : detachTrack(member.id, 'audio') }
	//                 break;
	//             case 'toggleRaiseHand':
	//                 if (channelStore.currentChannel.user == userData.id &&
	//                     userData.id != messageData.userId &&
	//                     messageData.isHandRaised
	//                 ) {
	//                     const snackBarRef = snackBar.open(
	//                         `${member.displayName} would like to participate`,
	//                         'Allow',
	//                         { duration: 5000, verticalPosition: 'top' }
	//                     )
	//                     snackBarRef.onAction().subscribe(() => {
	//                         try {
	//                             toggleUserType(member, true)
	//                         } catch (err) {
	//                             console.log(err)
	//                         }
	//                     })
	//                     // inAppSnackBarService.openSnackBar(`${member} would like to participate`, 'error', 3000, 'bottom', 'center')
	//                 }
	//                 break
	//             case 'toggleSilenceOnEveryone':
	//                 streamOptions.isEveryoneSilenced = messageData.isEveryoneSilenced
	//                 if (userData.id !== channelStore.currentChannel.user) {
	//                     await stopObsStream()
	//                     await stopScreenStream()
	//                     await stopWebcamStream()
	//                     await stopAudioStream()
	//                 }
	//                 break
	//             case 'toggleRestriction':
	//                 switch (messageData.featureType) {
	//                     case 'obs':
	//                         if (member.id === messageData.userId) {
	//                             member.obsState = messageData.featureState
	//                         }
	//                         if (userData.id === messageData.userId) {
	//                             userData.obsState = messageData.featureState
	//                             await stopObsStream(userData.obsState)
	//                         }
	//                         break
	//                     case 'screen':
	//                         if (member.id === messageData.userId) {
	//                             member.screenState = messageData.featureState
	//                         }
	//                         if (userData.id === messageData.userId) {
	//                             userData.screenState = messageData.featureState
	//                             await stopScreenStream(userData.screenState)
	//                         }
	//                         break
	//                     case 'webcam':
	//                         if (member.id === messageData.userId) {
	//                             member.webcamState = messageData.featureState
	//                         }
	//                         if (userData.id === messageData.userId) {
	//                             userData.webcamState = messageData.featureState
	//                             await stopWebcamStream(userData.webcamState)
	//                         }
	//                         break
	//                     case 'audio':
	//                         if (member.id === messageData.userId) {
	//                             member.audioState = messageData.featureState
	//                         }
	//                         if (userData.id === messageData.userId) {
	//                             userData.audioState = messageData.featureState
	//                             await stopAudioStream(userData.audioState)
	//                         }
	//                         break
	//                 }
	//                 break
	//         }
	//         updateUserInRoom(member)
	//     })
}

function disconnected() {
	console.log('disconnected')
	//TODO: determine if this is needed
	// if (!sharedService.wasHomePressed) {
	//     window.location.href = '/'
	// }
	streamOptions = {
		isRecording: false,
		isLiveStreaming: false,
		isEveryoneSilenced: false,
		duration: 0,
		hasWaitedOneSecondObs: true,
		hasWaitedOneSecondScreen: true,
		hasWaitedOneSecondWebcam: true,
		hasWaitedOneSecondAudio: true,
		hasWaitedOneSecondRecord: true,
		hasWaitedOneSecondRaiseHand: true,
		hasWaitedOneSecondSilence: true,
		isTimedOut: false,
		isMaxLimitReached: false
	}
	videoStreamId = ''
	roomMembers.set([])
	hasActiveTracks = false
	//TODO: determine if this is needed
	// sharedService.wasHomePressed = false

	//TODO: fix sockets
	// socketStore.emitRoomMemberUpdate({
	//     channelId: channelStore.currentChannel._id,
	//     userData: userData,
	//     isNewUser: false
	// })
	// if (authService.currentUser && channelStore.currentChannel.user == authService.currentUser._id) {
	//     updateLiveStream()
	//     channelStore.updateisLive({
	//         channelId: channelStore.currentChannel._id,
	//         isLive: false
	//     })
	// }
}

function getMember({
	_id,
	avatar,
	username,
	displayName,
	obsStream,
	screenStream,
	webcamStream,
	audioStream
}: {
	_id: string
	avatar: string
	username: string
	displayName: string
	obsStream: string
	screenStream: string
	webcamStream: string
	audioStream: string
}) {
	return {
		id: _id,
		avatar,
		username,
		displayName,
		userType: '', //TODO: fix subscribing to writeables _id == channelStore.currentChannel.user ? 'host' : 'listener',
		obsState: 'hibernate',
		screenState: 'hibernate',
		webcamState: 'hibernate',
		audioState: 'hibernate',
		isHandRaised: false,
		obsStream,
		screenStream,
		webcamStream,
		audioStream
	}
}

function updateUserInRoom(userData: any) {
	//TODO: fix subscribing to writeables
	// const roomUser = roomMembers.find((member) => member.id == userData.id)
	// if (roomUser) {
	//     Object.assign(roomUser, userData)
	// } else {
	//     if (userData.userType != 'listener') roomMembers.push(userData)
	// }
}

async function startObsStream() {
	if (streamOptions.hasWaitedOneSecondObs) {
		waitOneSecondObs()
		const trackName = `obs-${userData.id}`
		const liveInput = await getLiveInput({
			meta: { name: trackName },
			recording: { mode: 'automatic' }
		})
		userData.obsStream = liveInput
		userData.obsState = 'live'
		updateUserInRoom(userData)
		sendDataToRoom({ type: 'toggleTrack', trackType: 'obs' })
		streamOptions.isLiveStreaming = true
		// sfxService.playAudio(SoundEffect.StartedSharingScreen)
		waitOneSecondObs()
		checkForActiveTracks()
		//TODO: show alert
		// dialogService.openDialog({
		//     title: 'Streaming Information',
		//     message: `URL: + ${liveInput.webRTC.url}`,
		//     okText: 'OK'
		// }, {
		//     disableClose: true
		// })
	}
}

async function stopObsStream(state = 'hibernate') {
	await deleteLiveInput({ inputId: userData.obsStream?.uid })
	streamOptions.isLiveStreaming = false
	userData.obsStream = null
	userData.obsState = state
	updateUserInRoom(userData)
	sendDataToRoom({ type: 'toggleTrack', trackType: 'obs' })
	detachTrack({ memberId: userData.id, trackType: 'obs' })
	checkForActiveTracks()
}

async function startScreenStream() {
	if (streamOptions.hasWaitedOneSecondScreen) {
		waitOneSecondScreen()
		const trackName = `screen-${userData.id}`
		const liveInput = await getLiveInput({
			meta: { name: trackName },
			recording: { mode: 'automatic' }
		})
		userData.screenStream = liveInput
		const videoElement = createVideoElement({ memberId: userData.id, trackType: 'screen' })
		//TODO: add WHIPClient
		// const input = new WHIPClient(liveInput.webRTC.url, videoElement, 'screen')
		userData.screenState = 'live'
		updateUserInRoom(userData)
		sendDataToRoom({ type: 'toggleTrack', trackType: 'screen' })
		// userData.screenStream.on('stopped', () => {
		//     stopScreenStream()
		// })
		streamOptions.isLiveStreaming = true
		// sfxService.playAudio(SoundEffect.StartedSharingScreen)
		waitOneSecondScreen()
		checkForActiveTracks()
	}
}

function createVideoElement({
	memberId,
	trackType
}: {
	memberId: string
	trackType: string
}): HTMLVideoElement {
	const container =
		trackType !== 'audio'
			? document.getElementById('screen_container')
			: document.getElementById('audio_container')
	//TODO: get htmlviewelement in sveltekit
	const videoElement: HTMLVideoElement = new HTMLVideoElement() //renderer.createElement('video')
	videoElement.setAttribute('id', `${trackType}-${memberId}`)
	videoElement.setAttribute('autoplay', 'autoplay')

	const { matches: isMobile } = window.matchMedia('(max-width: 767px)')
	if (videoElement) {
		if (isMobile) {
			videoElement.style.width = '80%'
			videoElement.style.cssText =
				'scroll-snap-align: center; width: 80%!important; margin: 0 0.5rem;'
		} else {
			videoElement.style.width = '100%'
		}
		videoElement.addEventListener('dblclick', (event) => {
			if (document.fullscreenElement) {
				document.exitFullscreen()
			} else {
				videoElement.requestFullscreen()
			}
		})
		videoElement.addEventListener('click', (event) => {
			event.preventDefault()
			event.stopPropagation()
			videoElement.scrollIntoView()
		})
	}

	container?.append(videoElement)

	if (isMobile) {
		const allVideoElements = Array.prototype.slice.call(container?.getElementsByTagName('video'))
		allVideoElements.forEach((element, i) => {
			if (i === 0) element.style.marginLeft = '10%'
			else element.style.marginLeft = '0.5rem'
			if (allVideoElements.length === i + 1) element.style.marginRight = '10%'
			else element.style.marginRight = '0.5rem'
		})
	}

	return videoElement
}

function attachTrack({
	liveInput,
	memberId,
	trackType
}: {
	liveInput: any
	memberId: string
	trackType: string
}) {
	const videoElement = createVideoElement({ memberId, trackType })
	//TODO: add WHEPClient
	// const output = new WHEPClient(liveInput.webRTCPlayback.url, videoElement)
}

function detachTrack({ memberId, trackType }: { memberId: string; trackType: string }) {
	const videoElement = document.getElementById(`${trackType}-${memberId}`)
	videoElement?.remove()
}

async function stopScreenStream(state = 'hibernate') {
	await deleteLiveInput({ inputId: userData.screenStream?.uid })
	streamOptions.isLiveStreaming = false
	userData.screenStream = null
	userData.screenState = state
	updateUserInRoom(userData)
	sendDataToRoom({ type: 'toggleTrack', trackType: 'screen' })
	detachTrack({ memberId: userData.id, trackType: 'screen' })
	checkForActiveTracks()
}

async function startWebcamStream() {
	if (streamOptions.hasWaitedOneSecondWebcam) {
		waitOneSecondWebcam()
		const trackName = `webcam-${userData.id}`
		const liveInput = await getLiveInput({
			meta: { name: trackName },
			recording: { mode: 'automatic' }
		})
		userData.webcamStream = liveInput
		const videoElement = createVideoElement({ memberId: userData.id, trackType: 'webcam' })
		//TODO: add WHIPClient
		// const input = new WHIPClient(liveInput.webRTC.url, videoElement, 'webcam')
		userData.screenState = 'live'
		updateUserInRoom(userData)
		sendDataToRoom({ type: 'toggleTrack', trackType: 'webcam' })
		// userData.webcamStream.on('stopped', () => {
		//     stopWebcamStream()
		// })
		waitOneSecondWebcam()
		checkForActiveTracks()
	}
}

async function stopWebcamStream(state = 'hibernate') {
	await deleteLiveInput({ inputId: userData.webcamStream?.uid })
	userData.webcamStream = null
	userData.webcamState = state
	updateUserInRoom(userData)
	sendDataToRoom({ type: 'toggleTrack', trackType: 'webcam' })
	detachTrack({ memberId: userData.id, trackType: 'webcam' })
	checkForActiveTracks()
}

async function startAudioStream() {
	if (streamOptions.hasWaitedOneSecondAudio) {
		waitOneSecondAudio()
		const trackName = `audio-${userData.id}`
		const liveInput = await getLiveInput({
			meta: { name: trackName },
			recording: { mode: 'automatic' }
		})
		userData.audioStream = liveInput
		const videoElement = createVideoElement({ memberId: userData.id, trackType: 'audio' })
		//TODO: add WHIPClient
		// const input = new WHIPClient(liveInput.webRTC.url, videoElement, 'audio')
		userData.audioState = 'live'
		updateUserInRoom(userData)
		sendDataToRoom({ type: 'toggleTrack', trackType: 'audio' })
		// userData.audioStream.onended = () => {
		//     stopAudioStream()
		// }
		waitOneSecondAudio()
		checkForActiveTracks()
	}
}

async function stopAudioStream(state = 'hibernate') {
	await deleteLiveInput({ inputId: userData.audioStream?.uid })
	userData.audioStream = null
	userData.audioState = state
	updateUserInRoom(userData)
	sendDataToRoom({ type: 'toggleTrack', trackType: 'audio' })
	detachTrack({ memberId: userData.id, trackType: 'audio' })
	checkForActiveTracks()
}

//TODO: uncomment when adding video recording or when time limit for live streams
function checkForActiveTracks() {
	// hasActiveTracks = roomMembers.some(member => member.screenStream != null || member.webcamStream != null || member.audioStream != null)
	// if (!hasActiveTracks) endRecording()
}

async function leaveRoom() {
	// if (channelStore.currentChannel) {
	disconnected()
	stopObsStream()
	stopScreenStream()
	stopWebcamStream()
	stopAudioStream()
	//TODO: fix subscribring to room members writeable
	// if (roomMembersSubscription) {
	//     roomMembersSubscription.unsubscribe()
	// }
	// if (userActionsSubscription) {
	//     userActionsSubscription.unsubscribe()
	// }
	// }
}

function toggleRaiseHand() {
	if (streamOptions.hasWaitedOneSecondRaiseHand) {
		waitOneSecondRaiseHand()
		// sfxService.playAudio(SoundEffect.AskedToSpeak)
		sendDataToRoom({
			type: 'toggleRaiseHand',
			userId: userData.id,
			isHandRaised: true
		})
	}
}

function toggleSilenceOnEveryone() {
	if (streamOptions.hasWaitedOneSecondSilence) {
		waitOneSecondSilence()
		streamOptions.isEveryoneSilenced = !streamOptions.isEveryoneSilenced
		sendDataToRoom({
			type: 'toggleSilenceOnEveryone',
			isEveryoneSilenced: streamOptions.isEveryoneSilenced
		})
		//TODO: fix channel writeable
		// channelStore.updateChannelProperties({
		//     channelId: channelStore.currentChannel._id,
		//     updatedProperties: {
		//         isEveryoneSilenced: streamOptions.isEveryoneSilenced
		//     }
		// })
	}
}

function toggleUserType({ user, isHandRaised = false }: { user: any; isHandRaised: boolean }) {
	//TODO: fix channel writeable
	// if (user.userType === 'listener' || isHandRaised) {
	//     user.userType = 'participant'
	//     user.isHandRaised = false
	//     socketStore.emitRoomMemberUpdate({
	//         channelId: channelStore.currentChannel._id,
	//         userData: user,
	//         isNewUser: true
	//     })
	// } else if (user.userType === 'participant') {
	//     user.userType = 'listener'
	//     socketStore.emitRoomMemberUpdate({
	//         channelId: channelStore.currentChannel._id,
	//         userData: user,
	//         isNewUser: false
	//     })
	// }
}

function toggleRestriction({ user, featureType }: { user: any; featureType: string }) {
	let featureState = 'hibernate'
	switch (featureType) {
		case 'screen':
			if (user.screenState === 'restricted') {
				featureState = 'hibernate'
			} else {
				featureState = 'restricted'
			}
			user.screenState = featureState
			break
		case 'webcam':
			if (user.webcamState === 'restricted') {
				featureState = 'hibernate'
			} else {
				featureState = 'restricted'
			}
			user.webcamState = featureState
			break
		case 'audio':
			if (user.audioState === 'restricted') {
				featureState = 'hibernate'
			} else {
				featureState = 'restricted'
			}
			user.audioState = featureState
			break
	}
	sendDataToRoom({
		type: 'toggleRestriction',
		userId: user.id,
		featureType: featureType,
		featureState: featureState
	})
}

function sendDataToRoom(message: any) {
	// if (channelStore.currentChannel) {
	emitUserActions({
		channelId: '', //TODO: get channelId from writeable channelStore.currentChannel._id,
		userData: userData,
		message: JSON.stringify(message)
	})
	// }
}

async function waitOneSecondObs() {
	streamOptions.hasWaitedOneSecondObs = false
	setTimeout(async () => {
		streamOptions.hasWaitedOneSecondObs = true
	}, 1500)
}

async function waitOneSecondScreen() {
	streamOptions.hasWaitedOneSecondScreen = false
	setTimeout(async () => {
		streamOptions.hasWaitedOneSecondScreen = true
	}, 1500)
}

async function waitOneSecondWebcam() {
	streamOptions.hasWaitedOneSecondWebcam = false
	setTimeout(async () => {
		streamOptions.hasWaitedOneSecondWebcam = true
	}, 1500)
}

async function waitOneSecondAudio() {
	streamOptions.hasWaitedOneSecondAudio = false
	setTimeout(async () => {
		streamOptions.hasWaitedOneSecondAudio = true
	}, 1500)
}

async function waitOneSecondRecord() {
	streamOptions.hasWaitedOneSecondRecord = false
	setTimeout(async () => {
		streamOptions.hasWaitedOneSecondRecord = true
	}, 1500)
}

async function waitOneSecondRaiseHand() {
	streamOptions.hasWaitedOneSecondRaiseHand = false
	setTimeout(async () => {
		streamOptions.hasWaitedOneSecondRaiseHand = true
	}, 3000)
}

async function waitOneSecondSilence() {
	streamOptions.hasWaitedOneSecondSilence = false
	setTimeout(async () => {
		streamOptions.hasWaitedOneSecondSilence = true
	}, 3000)
}

async function createLiveStream({ channelId, title }: { channelId: string; title: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/streams`, {
		method: 'POST',
		body: JSON.stringify({ channel: channelId, title })
	}).then(async (response) => {
		const res = await response.json()
		videoStreamId = res._id
	})
}

async function updateLiveStream() {
	if (videoStreamId) {
		return await fetch(`${env.PUBLIC_API_URL}/streams/${videoStreamId}/end`, {})
	}
}

async function getLiveInput(trackData: any) {
	return await fetch(`${env.PUBLIC_API_URL}/cloudflare/live-input`, {
		method: 'POST',
		body: JSON.stringify(trackData)
	}).then((response) => response.json())
}

async function deleteLiveInput({ inputId }: { inputId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/cloudflare/live-input?inputId=${inputId}`, {
		method: 'DELETE'
	})
}

async function createStreamRecord(stream: any) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/stream`, {
		method: 'POST',
		body: stream
	})
}

async function updateProfileViews(view: any) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/profile/views/week`, {
		method: 'POST',
		body: view
	})
}

async function getProfileWeeklyViews(profile: any) {
	return await fetch(
		`${env.PUBLIC_API_URL}/stats/profile/views?id=${profile.id}&profileType=${profile.type}`,
		{
			method: 'GET'
		}
	)
}

async function updateTwitterShareCount(channelId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/channel/shared?channelId=${channelId}`, {
		method: 'PUT'
	})
}

async function getTwitterShareCount(channelId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/channel/shared?channelId=${channelId}`, {
		method: 'GET'
	})
}

async function getStreamStreak(userId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/stream/streak?userId=${userId}`, {
		method: 'GET'
	})
}

async function getStreamAvgLength(userId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/stream/avg-length?userId=${userId}`, {
		method: 'GET'
	})
}

async function getStreamTotalHours(userId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/stream/total-hours?userId=${userId}`, {
		method: 'GET'
	})
}

export {
	initRoomMembers,
	disconnected,
	updateUserInRoom,
	startObsStream,
	stopObsStream,
	startScreenStream,
	stopScreenStream,
	startWebcamStream,
	stopWebcamStream,
	startAudioStream,
	stopAudioStream,
	leaveRoom,
	toggleRaiseHand,
	toggleSilenceOnEveryone,
	toggleUserType,
	toggleRestriction,
	waitOneSecondObs,
	waitOneSecondScreen,
	waitOneSecondWebcam,
	waitOneSecondAudio,
	waitOneSecondRecord,
	waitOneSecondRaiseHand,
	waitOneSecondSilence,
	createLiveStream,
	updateLiveStream,
	getLiveInput,
	deleteLiveInput,
	createStreamRecord,
	updateProfileViews,
	getProfileWeeklyViews,
	updateTwitterShareCount,
	getTwitterShareCount,
	getStreamTotalHours,
	getStreamAvgLength,
	getStreamStreak
}

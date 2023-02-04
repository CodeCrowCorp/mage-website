import { writable, type Writable } from 'svelte/store'

export enum SoundEffect {
	All = 'All',
	AskedToSpeak = 'AskedToSpeak',
	ChannelUpdates = 'ChannelUpdates',
	FriendRequestReceived = 'FriendRequestReceived',
	FriendRequestSend = 'FriendRequestSend',
	MutedMic = 'MutedMic',
	UnmutedMic = 'UnmutedMic',
	SentMessage = 'SentMessage',
	ReceivedMessage = 'ReceivedMessage',
	StartedSharingScreen = 'StartedSharingScreen',
	StoppedSharingScreen = 'StoppedSharingScreen',
	UserJoinedChannel = 'UserJoinedChannel',
	UserLeftChannel = 'UserLeftChannel'
}

export const sfxList: Writable<
	(
		| { key: SoundEffect; path: null; isMuted: boolean }
		| { key: SoundEffect; path: string; isMuted: boolean }
	)[]
> = writable()

async function getAllSavedMutedSfx() {
	return sfxList.set([
		{
			key: SoundEffect.All,
			path: null,
			isMuted: await getIsMuted(SoundEffect.All)
		},
		{
			key: SoundEffect.AskedToSpeak,
			path: '../../assets/sfx/askedToSpeak.wav',
			isMuted: await getIsMuted(SoundEffect.AskedToSpeak)
		},
		{
			key: SoundEffect.ChannelUpdates,
			path: '../../assets/sfx/channelUpdates.wav',
			isMuted: await getIsMuted(SoundEffect.ChannelUpdates)
		},
		{
			key: SoundEffect.FriendRequestReceived,
			path: '../../assets/sfx/FriendRequestReceived.wav',
			isMuted: await getIsMuted(SoundEffect.FriendRequestReceived)
		},
		{
			key: SoundEffect.FriendRequestSend,
			path: '../../assets/sfx/friendRequestSend.wav',
			isMuted: await getIsMuted(SoundEffect.FriendRequestSend)
		},
		{
			key: SoundEffect.MutedMic,
			path: '../../assets/sfx/mutedMic.wav',
			isMuted: await getIsMuted(SoundEffect.MutedMic)
		},
		{
			key: SoundEffect.UnmutedMic,
			path: '../../assets/sfx/unmutedMic.wav',
			isMuted: await getIsMuted(SoundEffect.MutedMic)
		},
		{
			key: SoundEffect.SentMessage,
			path: '../../assets/sfx/sentMessage.wav',
			isMuted: await getIsMuted(SoundEffect.SentMessage)
		},
		{
			key: SoundEffect.ReceivedMessage,
			path: '../../assets/sfx/receivedMessage.wav',
			isMuted: await getIsMuted(SoundEffect.SentMessage)
		},
		{
			key: SoundEffect.StartedSharingScreen,
			path: '../../assets/sfx/startedSharingScreen.wav',
			isMuted: await getIsMuted(SoundEffect.StartedSharingScreen)
		},
		{
			key: SoundEffect.StoppedSharingScreen,
			path: '../../assets/sfx/stoppedSharingScreen.wav',
			isMuted: await getIsMuted(SoundEffect.StartedSharingScreen)
		},
		{
			key: SoundEffect.UserJoinedChannel,
			path: '../../assets/sfx/userJoinedChannel.wav',
			isMuted: await getIsMuted(SoundEffect.UserJoinedChannel)
		},
		{
			key: SoundEffect.UserLeftChannel,
			path: '../../assets/sfx/userLeftChannel',
			isMuted: await getIsMuted(SoundEffect.UserJoinedChannel)
		}
	])
}

async function getIsMuted(key: SoundEffect) {
	return JSON.parse(window.localStorage.getItem(key) || 'false')
}

// public playAudio(key: SoundEffect) {
//     const isMutedAll = sfxList.find((sfx: { key: SoundEffect; }) => sfx.key == SoundEffect.All).isMuted
//     const sfx = sfxList.find((sfx: { key: SoundEffect; }) => sfx.key == key)
//     if (!isMutedAll && !sfx.isMuted) {
//         const audio = new Audio()
//         const path = getPathFromKey(key)
//         audio.src = path
//         audio.load()
//         audio.play()
//     }
// }

// private getPathFromKey(key: SoundEffect) {
//     return sfxList.find((sfx: { key: SoundEffect; }) => sfx.key == key).path
// }

// public saveIsMuted(key: SoundEffect, isMuted: boolean) {
//     window.localStorage.setItem(key, isMuted.toString())
//     sfxList.find((sfx: { key: SoundEffect; }) => sfx.key == key).isMuted = isMuted
// }

export { getAllSavedMutedSfx, getIsMuted }

import { writable, type Writable } from 'svelte/store'
import { env } from '$env/dynamic/public'
import { channelStore } from '$lib/stores/channelStore'
import { socketStore } from '$lib/stores/socketStore'

class StreamStore {
    public videoStreamId = ''
    public hasActiveTracks = false

    public userData: {
        id: string
        avatar: any
        customUsername: any
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
            customUsername: null,
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

    public streamOptions: {
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

    constructor(
        public roomMembers: Writable<[]> = writable([]),
        public channelMembersCount: Writable<number> = writable(0),
    ) {}

    async getMembers({ channelId, isParticipant, skip, limit }: { channelId: string, isParticipant: boolean, skip: number, limit: number }) {
        return await fetch(`${env.PUBLIC_API_URL}/channel-members?channelId=${channelId}&isParticipant=${isParticipant}&skip=${skip}&limit=${limit}`, {
            method: 'GET',
        }).then(response => response.json())
    }

    async getChannelMembersCount({ channelId }: { channelId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channel-members/count?channelId=${channelId}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    async initRoomMembers() {
        //TODO: get currenChannel writeable
        // this.roomMembers = await this.getMembers({
        //     channelId: channelStore.currentChannel._id,
        //     isParticipant: true,
        //     skip: 0,
        //     limit: 10
        // })
        // this.channelMembersCount = await this.getChannelMembersCount({
        //     channelId: channelStore.currentChannel._id
        // })
        // Object.assign(this.userData, this.getMember(this.authService.currentUser))
        // const doesUserExist = this.roomMembers.some((member) => member.id == this.userData.id)
        // if (channelStore.currentChannel.user === this.userData.id && !doesUserExist) {
        //     this.roomMembers.push(this.userData)
        // }
        // socketStore.emitRoomMemberUpdate({
        //     channelId: channelStore.currentChannel._id,
        //     userData: this.userData,
        //     isNewUser: true
        // })
        // this.listenToRoomMemberUpdate()
        // this.listenToUserActions()

        // this.streamOptions.isEveryoneSilenced =
        //     channelStore.currentChannel.isEveryoneSilenced
        // if (channelStore.currentChannel.user === this.authService.currentUser._id) {
        //     await this.createLiveStream(
        //         channelStore.currentChannel._id,
        //         `${channelStore.currentChannel.title}-${channelStore.currentChannel.user}`
        //     )
        //     await channelStore.updateIsStreaming({
        //         channelId: channelStore.currentChannel._id,
        //         isStreaming: true
        //     })
        // }
    }

    listenToRoomMemberUpdate() {
        //TODO: fix subscribing to writeables
        // this.roomMembersSubscription = socketStore
        //     .listenToRoomMemberUpdate({
        //         channelId: channelStore.currentChannel._id
        //     })
        //     .subscribe(async (data) => {
        //         if (channelStore.currentChannel) {
        //             if (data.isNewUser) {
        //                 const doesUserExist = this.roomMembers.some(
        //                     (member) => member.id == data.userData.id
        //                 )
        //                 if (!doesUserExist && data.userData.userType != 'listener') {
        //                     this.roomMembers.push(data.userData)
        //                     if (this.userData.id == data.userData.id) {
        //                         this.userData = data.userData
        //                     }
        //                 }
        //             } else if (!data.isNewUser) {
        //                 const index = this.roomMembers.findIndex(
        //                     (item) => item.id == data.userData.id
        //                 )
        //                 if (index > -1) this.roomMembers.splice(index, 1)
        //                 if (this.userData.id == data.userData.id) {
        //                     this.userData = data.userData
        //                 }
        //             }
        //             if (data.userData.obsStream) this.attachTrack(data.userData.obsStream, data.userData.id, 'obs')
        //             if (data.userData.screenStream) this.attachTrack(data.userData.screenStream, data.userData.id, 'screen')
        //             if (data.userData.webcamStream) this.attachTrack(data.userData.webcamStream, data.userData.id, 'webcam')
        //             if (data.userData.audioStream) this.attachTrack(data.userData.audioStream, data.userData.id, 'audio')
        //             this.channelMembersCount = await this.getChannelMembersCount({
        //                 channelId: channelStore.currentChannel._id
        //             })
        //             console.log("this.channelMembersCount", this.channelMembersCount)
        //             channelStore.currentChannel.memberCount = this.channelMembersCount
        //         }
        //     })
    }

    listenToUserActions() {
        //TODO: fix subscribing to writeables
        // this.userActionsSubscription = socketStore
        //     .listenToUserActions({
        //         channelId: channelStore.currentChannel._id
        //     })
        //     .subscribe(async (data) => {
        //         const messageData = JSON.parse(data.message)
        //         let member = this.roomMembers.find((member) => member.id == messageData.userId)
        //         if (!member) member = data.userData
        //         switch (messageData.type) {
        //             case 'toggleTrack':
        //                 if (messageData.trackType === 'obs') { member.obsState === 'live' ? this.attachTrack(member.obsStream, data.userData.id, 'obs') : this.detachTrack(member.id, 'obs') }
        //                 if (messageData.trackType === 'screen' && this.userData.id !== member.id) {
        //                     member.screenState === 'live' ? this.attachTrack(member.screenStream, member.id, 'screen') : this.detachTrack(member.id, 'screen')
        //                 }
        //                 if (messageData.trackType === 'webcam' && this.userData.id !== member.id) { member.webcamState === 'live' ? this.attachTrack(member.webcamStream, member.id, 'webcam') : this.detachTrack(member.id, 'webcam') }
        //                 if (messageData.trackType === 'audio' && this.userData.id !== member.id) { member.audioState === 'live' ? this.attachTrack(member.audioStream, member.id, 'audio') : this.detachTrack(member.id, 'audio') }
        //                 break;
        //             case 'toggleRaiseHand':
        //                 if (channelStore.currentChannel.user == this.userData.id &&
        //                     this.userData.id != messageData.userId &&
        //                     messageData.isHandRaised
        //                 ) {
        //                     const snackBarRef = this.snackBar.open(
        //                         `${member.displayName} would like to participate`,
        //                         'Allow',
        //                         { duration: 5000, verticalPosition: 'top' }
        //                     )
        //                     snackBarRef.onAction().subscribe(() => {
        //                         try {
        //                             this.toggleUserType(member, true)
        //                         } catch (err) {
        //                             console.log(err)
        //                         }
        //                     })
        //                     // this.inAppSnackBarService.openSnackBar(`${member} would like to participate`, 'error', 3000, 'bottom', 'center')
        //                 }
        //                 break
        //             case 'toggleSilenceOnEveryone':
        //                 this.streamOptions.isEveryoneSilenced = messageData.isEveryoneSilenced
        //                 if (this.userData.id !== channelStore.currentChannel.user) {
        //                     await this.stopObsStream()
        //                     await this.stopScreenStream()
        //                     await this.stopWebcamStream()
        //                     await this.stopAudioStream()
        //                 }
        //                 break
        //             case 'toggleRestriction':
        //                 switch (messageData.featureType) {
        //                     case 'obs':
        //                         if (member.id === messageData.userId) {
        //                             member.obsState = messageData.featureState
        //                         }
        //                         if (this.userData.id === messageData.userId) {
        //                             this.userData.obsState = messageData.featureState
        //                             await this.stopObsStream(this.userData.obsState)
        //                         }
        //                         break
        //                     case 'screen':
        //                         if (member.id === messageData.userId) {
        //                             member.screenState = messageData.featureState
        //                         }
        //                         if (this.userData.id === messageData.userId) {
        //                             this.userData.screenState = messageData.featureState
        //                             await this.stopScreenStream(this.userData.screenState)
        //                         }
        //                         break
        //                     case 'webcam':
        //                         if (member.id === messageData.userId) {
        //                             member.webcamState = messageData.featureState
        //                         }
        //                         if (this.userData.id === messageData.userId) {
        //                             this.userData.webcamState = messageData.featureState
        //                             await this.stopWebcamStream(this.userData.webcamState)
        //                         }
        //                         break
        //                     case 'audio':
        //                         if (member.id === messageData.userId) {
        //                             member.audioState = messageData.featureState
        //                         }
        //                         if (this.userData.id === messageData.userId) {
        //                             this.userData.audioState = messageData.featureState
        //                             await this.stopAudioStream(this.userData.audioState)
        //                         }
        //                         break
        //                 }
        //                 break
        //         }
        //         this.updateUserInRoom(member)
        //     })
    }

    disconnected() {
        console.log('disconnected')
        //TODO: determine if this is needed
        // if (!this.sharedService.wasHomePressed) {
        //     window.location.href = '/'
        // }
        this.streamOptions = {
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
        this.videoStreamId = ''
        this.roomMembers.set([])
        this.hasActiveTracks = false
        //TODO: determine if this is needed
        // this.sharedService.wasHomePressed = false

        //TODO: fix sockets
        // socketStore.emitRoomMemberUpdate({
        //     channelId: channelStore.currentChannel._id,
        //     userData: this.userData,
        //     isNewUser: false
        // })
        // if (this.authService.currentUser && channelStore.currentChannel.user == this.authService.currentUser._id) {
        //     this.updateLiveStream()
        //     channelStore.updateIsStreaming({
        //         channelId: channelStore.currentChannel._id,
        //         isStreaming: false
        //     })
        // }
    }

    getMember({ _id, avatar, customUsername, displayName, obsStream, screenStream, webcamStream, audioStream }
        : { _id: string, avatar: string, customUsername: string, displayName: string, obsStream: string, screenStream: string, webcamStream: string, audioStream: string }) {
        return {
            id: _id,
            avatar: avatar,
            customUsername: customUsername,
            displayName: displayName,
            userType: '',//TODO: fix subscribing to writeables _id == channelStore.currentChannel.user ? 'host' : 'listener',
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

    updateUserInRoom(userData: any) {
        //TODO: fix subscribing to writeables
        // const roomUser = this.roomMembers.find((member) => member.id == userData.id)
        // if (roomUser) {
        //     Object.assign(roomUser, userData)
        // } else {
        //     if (userData.userType != 'listener') this.roomMembers.push(userData)
        // }
    }

    async startObsStream() {
        if (this.streamOptions.hasWaitedOneSecondObs) {
            this.waitOneSecondObs()
            const trackName = `obs-${this.userData.id}`
            const liveInput = await this.getLiveInput({ meta: { name: trackName }, recording: { mode: "automatic" } })
            this.userData.obsStream = liveInput
            this.userData.obsState = 'live'
            this.updateUserInRoom(this.userData)
            this.sendDataToRoom({ type: 'toggleTrack', trackType: 'obs' })
            this.streamOptions.isLiveStreaming = true
            // this.sfxService.playAudio(SoundEffect.StartedSharingScreen)
            this.waitOneSecondObs()
            this.checkForActiveTracks()
            //TODO: show alert
            // this.dialogService.openDialog({
            //     title: 'Streaming Information',
            //     message: `URL: + ${liveInput.webRTC.url}`,
            //     okText: 'OK'
            // }, {
            //     disableClose: true
            // })
        }
    }

    async stopObsStream(state = 'hibernate') {
        await this.deleteLiveInput({ inputId: this.userData.obsStream?.uid })
        this.streamOptions.isLiveStreaming = false
        this.userData.obsStream = null
        this.userData.obsState = state
        this.updateUserInRoom(this.userData)
        this.sendDataToRoom({ type: 'toggleTrack', trackType: 'obs' })
        this.detachTrack({ memberId: this.userData.id, trackType: 'obs' })
        this.checkForActiveTracks()
    }

    async startScreenStream() {
        if (this.streamOptions.hasWaitedOneSecondScreen) {
            this.waitOneSecondScreen()
            const trackName = `screen-${this.userData.id}`
            const liveInput = await this.getLiveInput({ meta: { name: trackName }, recording: { mode: "automatic" } })
            this.userData.screenStream = liveInput
            const videoElement = this.createVideoElement({ memberId: this.userData.id, trackType: 'screen' })
            //TODO: add WHIPClient
            // const input = new WHIPClient(liveInput.webRTC.url, videoElement, 'screen')
            this.userData.screenState = 'live'
            this.updateUserInRoom(this.userData)
            this.sendDataToRoom({ type: 'toggleTrack', trackType: 'screen' })
            // this.userData.screenStream.on('stopped', () => {
            //     this.stopScreenStream()
            // })
            this.streamOptions.isLiveStreaming = true
            // this.sfxService.playAudio(SoundEffect.StartedSharingScreen)
            this.waitOneSecondScreen()
            this.checkForActiveTracks()
        }
    }

    createVideoElement({ memberId, trackType }: { memberId: string, trackType: string }): HTMLVideoElement {
        const container = trackType !== 'audio' ? document.getElementById('screen_container') : document.getElementById('audio_container')
        //TODO: get htmlviewelement in sveltekit
        const videoElement: HTMLVideoElement = new HTMLVideoElement()//this.renderer.createElement('video')
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
            const allVideoElements = Array.prototype.slice.call(
                container?.getElementsByTagName('video')
            )
            allVideoElements.forEach((element, i) => {
                if (i === 0) element.style.marginLeft = '10%'
                else element.style.marginLeft = '0.5rem'
                if (allVideoElements.length === i + 1) element.style.marginRight = '10%'
                else element.style.marginRight = '0.5rem'
            })
        }

        return videoElement
    }

    attachTrack({ liveInput, memberId, trackType }: { liveInput: any, memberId: string, trackType: string }) {
        const videoElement = this.createVideoElement({ memberId, trackType })
        //TODO: add WHEPClient
        // const output = new WHEPClient(liveInput.webRTCPlayback.url, videoElement)
    }

    detachTrack({ memberId, trackType }: { memberId: string, trackType: string }) {
        const videoElement = document.getElementById(`${trackType}-${memberId}`)
        videoElement?.remove()
    }

    async stopScreenStream(state = 'hibernate') {
        await this.deleteLiveInput({ inputId: this.userData.screenStream?.uid })
        this.streamOptions.isLiveStreaming = false
        this.userData.screenStream = null
        this.userData.screenState = state
        this.updateUserInRoom(this.userData)
        this.sendDataToRoom({ type: 'toggleTrack', trackType: 'screen' })
        this.detachTrack({ memberId: this.userData.id, trackType: 'screen' })
        this.checkForActiveTracks()
    }

    async startWebcamStream() {
        if (this.streamOptions.hasWaitedOneSecondWebcam) {
            this.waitOneSecondWebcam()
            const trackName = `webcam-${this.userData.id}`
            const liveInput = await this.getLiveInput({ meta: { name: trackName }, recording: { mode: "automatic" } })
            this.userData.webcamStream = liveInput
            const videoElement = this.createVideoElement({ memberId: this.userData.id, trackType: 'webcam' })
            //TODO: add WHIPClient
            // const input = new WHIPClient(liveInput.webRTC.url, videoElement, 'webcam')
            this.userData.screenState = 'live'
            this.updateUserInRoom(this.userData)
            this.sendDataToRoom({ type: 'toggleTrack', trackType: 'webcam' })
            // this.userData.webcamStream.on('stopped', () => {
            //     this.stopWebcamStream()
            // })
            this.waitOneSecondWebcam()
            this.checkForActiveTracks()
        }
    }

    async stopWebcamStream(state = 'hibernate') {
        await this.deleteLiveInput({ inputId: this.userData.webcamStream?.uid })
        this.userData.webcamStream = null
        this.userData.webcamState = state
        this.updateUserInRoom(this.userData)
        this.sendDataToRoom({ type: 'toggleTrack', trackType: 'webcam' })
        this.detachTrack({ memberId: this.userData.id, trackType: 'webcam' })
        this.checkForActiveTracks()
    }

    async startAudioStream() {
        if (this.streamOptions.hasWaitedOneSecondAudio) {
            this.waitOneSecondAudio()
            const trackName = `audio-${this.userData.id}`
            const liveInput = await this.getLiveInput({ meta: { name: trackName }, recording: { mode: "automatic" } })
            this.userData.audioStream = liveInput
            const videoElement = this.createVideoElement({ memberId: this.userData.id, trackType: 'audio' })
            //TODO: add WHIPClient
            // const input = new WHIPClient(liveInput.webRTC.url, videoElement, 'audio')
            this.userData.audioState = 'live'
            this.updateUserInRoom(this.userData)
            this.sendDataToRoom({ type: 'toggleTrack', trackType: 'audio' })
            // this.userData.audioStream.onended = () => {
            //     this.stopAudioStream()
            // }
            this.waitOneSecondAudio()
            this.checkForActiveTracks()
        }
    }

    async stopAudioStream(state = 'hibernate') {
        await this.deleteLiveInput({ inputId: this.userData.audioStream?.uid })
        this.userData.audioStream = null
        this.userData.audioState = state
        this.updateUserInRoom(this.userData)
        this.sendDataToRoom({ type: 'toggleTrack', trackType: 'audio' })
        this.detachTrack({ memberId: this.userData.id, trackType: 'audio' })
        this.checkForActiveTracks()
    }

    //TODO: uncomment when adding video recording or when time limit for live streams
    checkForActiveTracks() {
        // this.hasActiveTracks = this.roomMembers.some(member => member.screenStream != null || member.webcamStream != null || member.audioStream != null)
        // if (!this.hasActiveTracks) this.endRecording()
    }

    async leaveRoom() {
        if (channelStore.currentChannel) {
            this.disconnected()
            this.stopObsStream()
            this.stopScreenStream()
            this.stopWebcamStream()
            this.stopAudioStream()
            //TODO: fix subscribring to room members writeable
            // if (this.roomMembersSubscription) {
            //     this.roomMembersSubscription.unsubscribe()
            // }
            // if (this.userActionsSubscription) {
            //     this.userActionsSubscription.unsubscribe()
            // }
        }
    }

    toggleRaiseHand() {
        if (this.streamOptions.hasWaitedOneSecondRaiseHand) {
            this.waitOneSecondRaiseHand()
            // this.sfxService.playAudio(SoundEffect.AskedToSpeak)
            this.sendDataToRoom({
                type: 'toggleRaiseHand',
                userId: this.userData.id,
                isHandRaised: true
            })
        }
    }

    toggleSilenceOnEveryone() {
        if (this.streamOptions.hasWaitedOneSecondSilence) {
            this.waitOneSecondSilence()
            this.streamOptions.isEveryoneSilenced = !this.streamOptions.isEveryoneSilenced
            this.sendDataToRoom({
                type: 'toggleSilenceOnEveryone',
                isEveryoneSilenced: this.streamOptions.isEveryoneSilenced
            })
            //TODO: fix channel writeable
            // channelStore.updateChannelProperties({
            //     channelId: channelStore.currentChannel._id,
            //     updatedProperties: {
            //         isEveryoneSilenced: this.streamOptions.isEveryoneSilenced
            //     }
            // })
        }
    }

    toggleUserType({ user, isHandRaised = false }: { user: any, isHandRaised: boolean }) {
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

    toggleRestriction({ user, featureType }: { user: any, featureType: string }) {
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
        this.sendDataToRoom({
            type: 'toggleRestriction',
            userId: user.id,
            featureType: featureType,
            featureState: featureState
        })
    }

    sendDataToRoom(message: any) {
        if (channelStore.currentChannel) {
            socketStore.emitUserActions({
                channelId: '',//TODO: get channelId from writeable channelStore.currentChannel._id,
                userData: this.userData,
                message: JSON.stringify(message)
            })
        }
    }

    public waitOneSecondObs() {
        this.streamOptions.hasWaitedOneSecondObs = false
        setTimeout(async () => {
            this.streamOptions.hasWaitedOneSecondObs = true
        }, 1500)
    }

    public waitOneSecondScreen() {
        this.streamOptions.hasWaitedOneSecondScreen = false
        setTimeout(async () => {
            this.streamOptions.hasWaitedOneSecondScreen = true
        }, 1500)
    }

    public waitOneSecondWebcam() {
        this.streamOptions.hasWaitedOneSecondWebcam = false
        setTimeout(async () => {
            this.streamOptions.hasWaitedOneSecondWebcam = true
        }, 1500)
    }

    public waitOneSecondAudio() {
        this.streamOptions.hasWaitedOneSecondAudio = false
        setTimeout(async () => {
            this.streamOptions.hasWaitedOneSecondAudio = true
        }, 1500)
    }

    public waitOneSecondRecord() {
        this.streamOptions.hasWaitedOneSecondRecord = false
        setTimeout(async () => {
            this.streamOptions.hasWaitedOneSecondRecord = true
        }, 1500)
    }

    public waitOneSecondRaiseHand() {
        this.streamOptions.hasWaitedOneSecondRaiseHand = false
        setTimeout(async () => {
            this.streamOptions.hasWaitedOneSecondRaiseHand = true
        }, 3000)
    }

    public waitOneSecondSilence() {
        this.streamOptions.hasWaitedOneSecondSilence = false
        setTimeout(async () => {
            this.streamOptions.hasWaitedOneSecondSilence = true
        }, 3000)
    }

    async createLiveStream({ channelId, title }: { channelId: string, title: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/streams`, {
            method: 'POST',
            body: JSON.stringify({ channel: channelId, title })
        }).then(async response => {
            const res = await response.json()
            this.videoStreamId = res._id
        })
    }

    async updateLiveStream() {
        if (this.videoStreamId) {
            return await fetch(`${env.PUBLIC_API_URL}/streams/${this.videoStreamId}/end`, {})
        }
    }

    async getLiveInput(trackData: any) {
        return await fetch(`${env.PUBLIC_API_URL}/cloudflare/live-input`, {
            method: 'POST',
            body: JSON.stringify(trackData)
        }).then(response => response.json())
    }

    async deleteLiveInput({ inputId }: { inputId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/cloudflare/live-input?inputId=${inputId}`, {
            method: 'DELETE'
        })
    }
}

export const streamStore = new StreamStore()
import { get, writable, type Writable } from 'svelte/store'
import { env } from '$env/dynamic/public'
import { currentUser } from '$lib/stores/authStore'

let skip = 0
let limit = 100

export const searchQuery: Writable<string> = writable('')
export const currentChannel: Writable<any> = writable(null)
export const myChannels: Writable<[]> = writable([])
export const channels: Writable<[]> = writable([])
export const searchedchannels: Writable<[]> = writable([])
export const techList: Writable<[]> = writable([])

async function createChannel({
	title,
	description,
	thumbnail,
	category,
	tags,
	isPrivate = false,
	user,
	channelType
}: {
	title: string
	description: string
	thumbnail: string
	category: string[]
	tags: string[]
	isPrivate: boolean
	user: any
	channelType: string
}) {
	return await fetch(`${env.PUBLIC_API_URL}/channel`, {
		method: 'POST',
		body: JSON.stringify({
			title,
			description,
			thumbnail,
			category,
			tags,
			isPrivate,
			user: user._id,
			createdBy: user.displayName,
			avatar: user.avatar,
			isHostActive: true,
			channelType
		})
	}).then(async (response) => {
		const res = await response.json()
		if (channelType === 'channel') {
			await addHostChannelToUser({ hostChannelId: res.channel._id })
			currentChannel.set(res)
		}
		return res
	})
}

async function deleteChannel({ channelId }: { channelId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/channels/${channelId}?bucketName=attachments`, {
		method: 'DELETE'
	})
}

async function getChannel({ channelId }: { channelId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/channel?channelId=${channelId}`, {
		method: 'GET'
	}).then((response) => response.json())
}

async function addChannelToUser({ channelId }: { channelId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/users/channels?channelId=${channelId}`, {
		method: 'GET'
	}).then(async (response) => {
		const res = await response.json()
		//TODO: update user in authStore
	})
}

async function removeChannelFromUser({ channelId, userId }: { channelId: string; userId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/users/channels?channelId=${channelId}`, {
		method: 'DELETE'
	}).then(async (response) => {
		const res = await response.json()
		//TODO: update user in authStore
		//if (this.user == userId) this.authService.setUser(userUpdate)
	})
}

async function addHostChannelToUser({ hostChannelId }: { hostChannelId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/users/host-channels?hostChannelId=${hostChannelId}`, {
		method: 'PUT'
	}).then(async (response) => {
		const res = await response.json()
		//TODO: update user in authStore
	})
}

async function removeHostChannelFromUser({ hostChannelId }: { hostChannelId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/users/host-channels?hostChannelId=${hostChannelId}`, {
		method: 'DELETE'
	}).then(async (response) => {
		const res = await response.json()
		//TODO: update user in authStore
	})
}

async function blockUserFromChannel({ channelId, userId }: { channelId: string; userId: string }) {
	return await fetch(
		`${env.PUBLIC_API_URL}/channels/blocked-users?channelId=${channelId}&userId=${userId}`,
		{
			method: 'PATCH'
		}
	)
}

async function unblockUserFromChannel({
	channelId,
	userId
}: {
	channelId: string
	userId: string
}) {
	return await fetch(
		`${env.PUBLIC_API_URL}/channels/blocked-users?channelId=${channelId}&userId=${userId}`,
		{
			method: 'DELETE'
		}
	)
}

async function updateChannelProperties({
	channelId,
	updatedProperties
}: {
	channelId: string
	updatedProperties: any
}) {
	return await fetch(`${env.PUBLIC_API_URL}/channels?channelId=${channelId}`, {
		method: 'PATCH',
		body: JSON.stringify(updatedProperties)
	})
}

//TODO: fix this
// isUserBlockedFromChannel({ userId }: { userId: string }) {
//     return this.currentChannel.blockedUsers?.some((user) => !!(user == userId))
// }

async function addAttachments({
	channelId,
	attachmentUrl
}: {
	channelId: string
	attachmentUrl: string
}) {
	return await fetch(
		`${
			env.PUBLIC_API_URL
		}/channels/attachments?channelId=${channelId}&encodeURIComponent=${encodeURIComponent(
			attachmentUrl
		)}`,
		{
			method: 'PUT'
		}
	)
}

async function deleteAttachment({
	channelId,
	attachmentUrl
}: {
	channelId: string
	attachmentUrl: string
}) {
	return await fetch(
		`${
			env.PUBLIC_API_URL
		}/channels/attachments?channelId=${channelId}&encodeURIComponent=${encodeURIComponent(
			attachmentUrl
		)}`,
		{
			method: 'DELETE'
		}
	)
}

async function addChannelNotificationSubscriber({
	channelId,
	userId
}: {
	channelId: string
	userId: string
}) {
	return await fetch(
		`${env.PUBLIC_API_URL}/channels/notification-subscribers?channelId=${channelId}&userId=${userId}`,
		{
			method: 'PUT'
		}
	)
}

async function removeChannelNotificationSubscriber({
	channelId,
	userId
}: {
	channelId: string
	userId: string
}) {
	return await fetch(
		`${env.PUBLIC_API_URL}/channels/notification-subscribers?channelId=${channelId}&userId=${userId}`,
		{
			method: 'DELETE'
		}
	)
}

async function deleteMembers({ channelId }: { channelId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/channel-members?channelId=${channelId}`, {
		method: 'DELETE'
	})
}

function resetSkipLimit() {
	skip = 0
	limit = 100
}

async function getMyChannels() {
	return await fetch(`${env.PUBLIC_API_URL}/channels/me/hosted`, {
		method: 'GET'
	}).then(async (response) => {
		const res = await response.json()
		myChannels.set(res)
	})
}

async function getChannelsByUserId({
	userId,
	searchQuery = '',
	skip = 0,
	limit = 50
}: {
	userId: string
	searchQuery: string
	skip?: number
	limit?: number
}) {
	return await fetch(
		`${env.PUBLIC_API_URL}/channels/user?userId=${userId}&searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`,
		{
			method: 'GET'
		}
	).then((response) => response.json())
}

async function getChannels({ isRefresh = false }: { isRefresh?: boolean } = {}) {
	if (isRefresh) {
		resetSkipLimit()
	}

	const result = await fetch(
		`${env.PUBLIC_API_URL}/channels?searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`,
		{
			method: 'GET'
		}
	)

	if (result.ok) {
		return await result.json()
	} else {
		throw new Error('Error fetching channels')
	}

	// then(async (response) => {
	// 	console.log('response', response)

	// 	const res = await response.json()
	// 	if (res.length) {
	// 		skip += limit
	// 		console.log('res', res)
	//TODO: push res to channels
	// channels.update(current => [...current, res])
	// } else {
	//TODO: show alert
	// if ((this.searchQuery || this.filterTechList.length) && !this.skip)
	//     this.snackBar.open('No results with the search criteria', null, {
	//         duration: 2000
	//     })
	// }
	// console.log(channels)
	// return channels
	// })
}

async function leaveChannel({
	userId,
	deleteOrLeaveOnExit = false
}: {
	userId: string
	deleteOrLeaveOnExit?: boolean
}) {
	//TODO: fix writeable subscribe
	currentChannel.subscribe(async (value) => {
		if (value) {
			if (value.user === userId) {
				// if host
				if (deleteOrLeaveOnExit) {
					await removeHostChannelFromUser({
						hostChannelId: value._id
					})
					await deleteChannel({ channelId: value._id })
					await deleteMembers({
						channelId: value._id
					})
				}
			} else {
				// if participant
				if (deleteOrLeaveOnExit) {
					await removeChannelFromUser({
						channelId: value._id,
						userId
					})
				}
			}
			currentChannel.set(null)
		}
	})
}

async function enterChannel({ channel }: { channel: any }) {
	currentChannel.set(channel)
	return currentChannel
}

async function toggleNotifications({ channel, userId }: { channel: any; userId: string }) {
	if (channel?.notificationSubscribers?.includes(userId)) {
		await removeChannelFromUser({ channelId: channel._id, userId })
		await removeChannelNotificationSubscriber({
			channelId: channel._id,
			userId
		})
	} else {
		await addChannelToUser({ channelId: channel._id })
		await addChannelNotificationSubscriber({
			channelId: channel._id,
			userId
		})
	}
}

// async sendToken({ channelId }) {
//     await lastValueFrom(this.http
//         .get(`${env.PUBLIC_API_URL}/token/sendToken?channelId=${channelId}`, {
//             responseType: 'text'
//         })).then((res) => {
//             return this.snackBar.open('You received 1 recursion Token', null, {
//                 duration: 2500
//             })
//         }).catch((err) => {
//             console.log('Err', err)
//         })
// }

// async getTechList() {
//     if (this.techList.length < 1) {
//         const web2Assets: any = await lastValueFrom(this.http
//             .get(`${environment.hostUrl}/assets/images/web2/_categoryWeb2.json`))
//         const web3Assets: any = await lastValueFrom(this.http
//             .get(`${environment.hostUrl}/assets/images/web3/_categoryWeb3.json`))
//         const gameAssets: any = await lastValueFrom(this.http
//             .get(`${environment.hostUrl}/assets/images/games/_categoryGames.json`))
//         web3Assets.forEach((file) => {
//             let fileName = file.item_image.substring(file.item_image.lastIndexOf('/') + 1)
//             fileName = fileName.substring(0, fileName.indexOf('.'))
//             const nameAndTickerList = fileName.split('-')
//             const ticker = nameAndTickerList.pop().toUpperCase()
//             const fullName = nameAndTickerList
//                 .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
//                 .join(' ')
//             file.item_text = `${fullName} (${ticker})`
//         })
//         web2Assets.push(...web3Assets)
//         gameAssets.forEach((file) => {
//             let fileName = file.item_image.substring(file.item_image.lastIndexOf('/') + 1)
//             fileName = fileName.substring(0, fileName.indexOf('.'))
//             const nameSplitList = fileName.split('-')
//             const fullName = nameSplitList
//                 .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
//                 .join(' ')
//             file.item_text = fullName
//         })
//         web2Assets.push(...gameAssets)
//         this.techList = web2Assets
//         this.techList.sort((a, b) => a.item_text.localeCompare(b.item_text))
//     }
// }

async function getTechList() {
	if (get(techList).length < 1) {
		let web2Assets: any = await fetch(`/category/web2/_categoryWeb2.json`, {
			method: 'GET'
		})
		let web3Assets: any = await fetch(`/category/web3/_categoryWeb3.json`, {
			method: 'GET'
		})
		let gameAssets: any = await fetch(`/category/games/_categoryGames.json`, {
			method: 'GET'
		})
		if (web2Assets.ok) {
			web2Assets = await web2Assets.json()
		}
		if (web3Assets.ok) {
			web3Assets = await web3Assets.json()
		}
		if (gameAssets.ok) {
			gameAssets = await gameAssets.json()
		}

		web3Assets.forEach((file: any) => {
			let fileName = file.item_image.substring(file.item_image.lastIndexOf('/') + 1)
			fileName = fileName.substring(0, fileName.indexOf('.'))
			const nameAndTickerList = fileName.split('-')
			const ticker = nameAndTickerList.pop().toUpperCase()
			const fullName = nameAndTickerList
				.map((name: any) => name.charAt(0).toUpperCase() + name.slice(1))
				.join(' ')
			file.item_text = `${fullName} (${ticker})`
		})
		web2Assets.push(...web3Assets)
		gameAssets.forEach((file: any) => {
			let fileName = file.item_image.substring(file.item_image.lastIndexOf('/') + 1)
			fileName = fileName.substring(0, fileName.indexOf('.'))
			const nameSplitList = fileName.split('-')
			const fullName = nameSplitList
				.map((name: any) => name.charAt(0).toUpperCase() + name.slice(1))
				.join(' ')
			file.item_text = fullName
		})
		web2Assets.push(...gameAssets)
		techList.set(web2Assets)
	}
}

async function getTechListJson() {
	if (get(techList).length < 1) {
		let gameAssets: any = await fetch(`svg-json/image_urls.json`, {
			method: 'GET'
		})
		if (gameAssets.ok) {
			gameAssets = await gameAssets.json()
		}
		techList.set(gameAssets)
		return gameAssets
	}
}

async function getTags() {
	let tags: any = await fetch(`${env.PUBLIC_API_URL}/tags`, {
		method: 'GET'
	})
	if (tags.ok) {
		tags = await tags.json()
	}
	return tags
}

export {
	createChannel,
	deleteChannel,
	getChannel,
	addChannelToUser,
	removeChannelFromUser,
	addHostChannelToUser,
	removeHostChannelFromUser,
	blockUserFromChannel,
	unblockUserFromChannel,
	updateChannelProperties,
	addAttachments,
	deleteAttachment,
	addChannelNotificationSubscriber,
	removeChannelNotificationSubscriber,
	deleteMembers,
	getMyChannels,
	getChannelsByUserId,
	getChannels,
	leaveChannel,
	enterChannel,
	toggleNotifications,
	getTechListJson,
	getTags
}

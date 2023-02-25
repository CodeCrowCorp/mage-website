import { get, writable, type Writable } from 'svelte/store'
import { env } from '$env/dynamic/public'

export const searchQuery: Writable<string> = writable('')
export const currentChannel: Writable<any> = writable(null)
export const techList: Writable<[]> = writable([])
export const tags: Writable<any> = writable([])
export const categoryAssets: Writable<{
	web2: object
	web3: object
	game: object
}> = writable({ web2: {}, web3: {}, game: {} })

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

async function getMyChannels({ skip = 0, limit = 50 }: { skip: number; limit: number }) {
	return await fetch(`${env.PUBLIC_API_URL}/channels/me/hosted?skip=${skip}&limit=${limit}`, {
		method: 'GET'
	}).then((response) => response.json())
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

async function getFavChannels({ skip = 0, limit = 50 }: { skip: number; limit: number }) {
	return await fetch(`${env.PUBLIC_API_URL}/channels/me/fav?skip=${skip}&limit=${limit}`, {
		method: 'GET'
	}).then((response) => response.json())
}

async function getMostActiveChannels({ skip = 0, limit = 50 }: { skip: number; limit: number }) {
	return await fetch(`${env.PUBLIC_API_URL}/channels/most-active?skip=${skip}&limit=${limit}`, {
		method: 'GET'
	}).then((response) => response.json())
}

async function getWeeklyChannels({ skip = 0, limit = 50 }: { skip: number; limit: number }) {
	return await fetch(`${env.PUBLIC_API_URL}/channels/weekly?skip=${skip}&limit=${limit}`, {
		method: 'GET'
	}).then((response) => response.json())
}

async function getChannels({ skip = 0, limit = 50 }: { skip: number; limit: number }) {
	const q = get(searchQuery)
	return await fetch(
		`${env.PUBLIC_API_URL}/channels?searchQuery=${q}&skip=${skip}&limit=${limit}`,
		{
			method: 'GET'
		}
	).then((response) => response.json())
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

async function getTechListJson() {
	if (get(techList).length < 1) {
		let gameAssets: any = await fetch(`/svg-json/image_urls.json`, {
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
	return await fetch(`${env.PUBLIC_API_URL}/tags`, {
		method: 'GET'
	}).then(async (response) => {
		const res = await response.json()
		tags.set(res)
	})
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
	getFavChannels,
	getMostActiveChannels,
	getWeeklyChannels,
	getChannels,
	leaveChannel,
	enterChannel,
	toggleNotifications,
	getTechListJson,
	getTags
}

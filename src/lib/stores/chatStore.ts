import { writable, type Writable } from 'svelte/store'
import { env } from '$env/dynamic/public'

let lastMessageSendDate: Date = new Date()
let skip = 0
let limit = 100

export const searchQuery: Writable<string> = writable('')
export const chats: Writable<[]> = writable([])
export const messages: Writable<[]> = writable([])
export const activeTabs: Writable<[]> = writable([])
export const isShowingSearchResults: Writable<boolean> = writable(false)

function resetSkipLimit() {
	skip = 0
	limit = 100
}

// function deleteMessage({ message, channelId }: { message: any; channelId: string }) {
// 	emitDeleteMessageToChannel({ channelId, message: JSON.stringify(message) })
// }

// function deleteAllMessages({ channelId }: { channelId: string }) {
// 	emitDeleteAllMessagesToChannel({ channelId })
// }

async function postFile({ channelId, fileToUpload }: { channelId: string; fileToUpload: File }) {
	const formData: FormData = new FormData()
	formData.append('file', fileToUpload, fileToUpload.name)
	formData.append('channelId', channelId)
	formData.append('name', fileToUpload.name)
	formData.append('type', fileToUpload.type)
	return await fetch(`${env.PUBLIC_API_URL}/attachments/file`, {
		method: 'POST',
		body: JSON.stringify(formData)
	})
}

async function deleteFile({ key }: { key: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/attachments/file?key=${key}`, {
		method: 'DELETE'
	})
}

async function getTrendingGifs() {
	return await fetch(`${env.PUBLIC_API_URL}/giphy/trending`, {
		method: 'GET'
	}).then((response) => response.json())
}

async function searchGifs({ query }: { query: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/giphy/search?${query}`, {
		method: 'GET'
	}).then((response) => response.json())
}

async function getMessages({ chat, chatType }: { chat: any; chatType: string }) {
	const data = { limit: limit, skip: 0 }
	if (chatType == 'channelChat') {
		skip = skip + limit
		data.skip = skip
		// emitHistoryToChannel({ channelId: chat.channel, skip: data.skip })
	} else if (chatType == 'oneToOneChat') {
		data.skip = chat.skip
	}
}

async function sendChannelMessage({ channel, attributes }: { channel: any; attributes: any }) {
	const dateNow = new Date()
	const diff = Math.round(Math.abs((dateNow.getTime() - lastMessageSendDate.getTime()) / 1000))
	if (diff <= 0.7) {
		//TODO: show alert
		// snackBar.open('Please be courteous to other users', null, {
		//     duration: 1000
		// })
	} else {
		//TODO: get currentUser
		const user: any = null
		attributes.userId = user._id
		attributes.avatar = user.avatar
		const completeMessage = {
			attributes: attributes,
			body: attributes.text,
			state: { timestamp: new Date().toISOString() },
			user: user,
			author: user.displayName
		}
		// emitMessageToChannel({ channelId: channel._id, message: completeMessage })
		lastMessageSendDate = new Date()
		// sendEmailAndWebNotifications({ channel: channel._id, user, attributes })
	}
}

async function sendChatMessage({ chat, attributes }: { chat: any; attributes: any }) {
	//TODO: get currentUser
	const user: any = null
	attributes.userId = user._id
	attributes.avatar = user.avatar
	const completeMessage = {
		attributes: attributes,
		body: attributes.text,
		state: { timestamp: new Date().toISOString() },
		user: user,
		author: user.displayName
	}
	// emitChatMessage({ source1: chat.source1, source2: chat.source2, message: completeMessage })
	lastMessageSendDate = new Date()
	// sendEmailAndWebNotifications({ channel: chat._id, user, attributes })
}

// async function sendEmailAndWebNotifications({ channel, user, attributes }: { channel: any, user: any, attributes: any }) {
//     let notificationSubscribers = []
//     notificationSubscribers = channel?.notificationSubscribers?.filter((id: any) =>
//         id == user._id ? false : true
//     )
//     if (notificationSubscribers?.length) {
//         const sendNotificationsTo: any[] = []
//         // const sendEmailsTo = []
//         notificationSubscribers = await userStore.getUsersByIds(notificationSubscribers)
//         notificationSubscribers.forEach((user: any) => {
//             if (user.isWebNotificationsEnabled) sendNotificationsTo.push(user._id)
//             // if (user.isEmailNotificationsEnabled) sendEmailsTo.push(user._id)
//         })
//         const body = `${user.username}: ${attributes.text}`
//         const title = `New message at ${channel.title}`
//         const sendToList = []
//         // if (sendNotificationsTo.length) {
//         //     sendToList.push(
//         //         notificationService.sendWebNotifications({
//         //             body,
//         //             title,
//         //             userIds: sendNotificationsTo
//         //         })
//         //     )
//         // }
//         // if (sendEmailsTo.length) {
//         //   sendToList.push(notificationService.sendEmails({
//         //     subject: `Chat notification from codecrow.io`, message: body, name: channel.title, userIds: sendEmailsTo, url: `${environment.hostUrl}/channel/${channel._id}`
//         //   }))
//         // }
//         return Promise.all(sendToList)
//     } else {
//         return Promise.resolve()
//     }
// }

function emitChannelChatTyping({
	typingUser,
	channelId = ''
}: {
	typingUser: any
	channelId: string
}) {
	if (!channelId) {
		// emitChatTypingByUser(typingUser)
	} else {
		// emitChannelChatTypingByUser({ channelId, typingUser })
	}
}

async function createChat({ source1, source2 }: { source1: string; source2: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/chats`, {
		method: 'PUT',
		body: JSON.stringify({ source1, source2 })
	}).then(async (response) => {
		const res = await response.json()
		//TODO: fix array push to writable
		// chats.subscribe((value: any) => {
		//     const doesChatExist = value.some((cht: any) => res._id === cht._id)
		//     if (!doesChatExist) value.push(res)
		//     return res
		// })
	})
}

async function getChat({ source1, source2 }: { source1: string; source2: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/chats/me?source1=${source1}&source2=${source2}`, {
		method: 'GET'
	}).then((response) => response.json())
}

async function getChats(isRefresh = false) {
	if (isRefresh) {
		chats.set([])
		resetSkipLimit()
	}
	return await fetch(
		`${env.PUBLIC_API_URL}/chats?searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`,
		{
			method: 'GET'
		}
	).then(async (response) => {
		const res = await response.json()
		//TODO: fix array push to writable
		// if (chats.length) {
		//     skip += limit
		//     chats.push(...chats)
		// } else {
		//TODO: show alert
		// if (searchQuery && !skip)
		//     snackBar.open('No results with the search criteria', null, {
		//         duration: 2000
		//     })
		// }
		// return chats
	})
}

async function deleteChat({ chat }: { chat: any }) {
	// const dialogData: DialogData = {
	//     title: 'Delete Chat',
	//     message: 'Are you sure you want to delete this chat?',
	//     okText: 'Yes',
	//     cancelText: 'Cancel'
	// }

	// const dialogRef = dialogService.openDialog(dialogData, {
	//     disableClose: true
	// })

	// dialogRef.afterClosed().subscribe(async (result: any) => {
	//     if (result) {
	await fetch(`${env.PUBLIC_API_URL}/chats?chatId=${chat._id}`, {
		method: 'DELETE'
	}).then(async (response) => {
		await response.json()
		//TODO: fix array filter to writable
		// chats.set(chats.filter((cht) => cht.chat._id !== chat._id))
	})
	//     }
	// })
}

async function updateChatProperties({
	chatId,
	updatedProperties
}: {
	chatId: string
	updatedProperties: any
}) {
	return await fetch(`${env.PUBLIC_API_URL}/chats?chatId=${chatId}`, {
		method: 'PATCH',
		body: JSON.stringify(updatedProperties)
	}).then((response) => response.json())
}

async function incrementUnreadMessageCount({ chatId }: { chatId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/chats?unread/chatId=${chatId}`, {
		method: 'PATCH'
	})
}

async function clearUnreadMessageCount({ chatId }: { chatId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/chats?unread/chatId=${chatId}`, {
		method: 'DELETE'
	})
}

async function searchChats() {
	chats.set([])
	return getChats(true)
}

async function openChat({ chat, friendGroup = null }: { chat: any; friendGroup: any }) {
	if (friendGroup) {
		return activateGroupTab(friendGroup)
	}
	//TODO: get writable channel id
	// if (!chat.chat) {
	//     const existingChat = await getChat({
	//         source1: authStore.currentUser._id,
	//         source2: chat._id
	//     })
	//     if (!existingChat) {
	//         chat = await createChat({
	//             source1: authStore.currentUser._id,
	//             source2: chat._id
	//         })
	//     } else {
	//         chat = existingChat
	//     }
	// }
	// activateChatTab(chat)
	// socketStore.emitChatMessage({
	//     source1: authStore.currentUser._id,
	//     source2: chat._id,
	//     message: "incoming message"
	// })
}

async function activateChatTab({ chat }: { chat: any }) {
	// const user = authStore.currentUser
	if (checkAlreadyExist(chat)) return
	//TODO: get writable activeTabs
	// activeTabs.push(chat)
	await clearUnreadMessageCount({ chatId: chat.chat._id })
	chat.chat.unreadMessageCount = 0
}

async function activateGroupTab({ group }: { group: any }) {
	// const user = authStore.currentUser
	if (checkAlreadyExist(group)) return
	//TODO: get writable activeTabs
	// socketStore.emitChannelSubscribeByUser(group.channelId, user._id)
	// activeTabs.push(group)
}

function checkAlreadyExist({ item }: { item: any }) {
	//TODO: get writable currentUser
	// const chat = activeTabs.find((chat) => {
	//     if (chat._id === item._id || ((chat.source1 === item.source1 && chat.source2 === item.source2) ||
	//         (chat.source2 === item.source1 && chat.source1 === item.source2))) {
	//         return true
	//     }
	// })
	// return (activeTabs.indexOf(item) !== -1) || (chat !== undefined)
	return null
}

async function incomingMessageActivateChatTab(data: any) {
	// const user = authStore.currentUser
	// const otherUser = userStore.getUserById(data.source1)
	const chat = null
	//TODO: get writable currentUser
	// const existingChat = await getChat({
	//     source1: authStore.currentUser._id,
	//     source2: data.source1
	// })
	// if (!existingChat) {
	//     chat = await createChat({
	//         source1: authStore.currentUser._id,
	//         source2: data.source1,
	//         user: otherUser
	//     })
	// } else {
	//     chat = existingChat
	// }
	// if (!user.isDoNotDisturbEnabled) {
	//     chat.isUserRequestingToOpenChat = true
	//     initIncomingMessage = data
	//     activateChatTab(chat)
	// }
}

async function blockUser({ senderId, isBlocked }: { senderId: string; isBlocked: boolean }) {
	//TODO: get writable channel id
	// await channelStore.blockUserFromChannel({
	//     channelId: channelStore.currentChannel._id,
	//     userId: senderId
	// })
	// await channelStore.removeChannelNotificationSubscriber({
	//     channelId: channelStore.currentChannel._id,
	//     userId: senderId
	// })
	// socketStore.emitRemovedUser(channelStore.currentChannel._id, senderId)
	// channelStore.currentChannel.blockedUsers?.push(senderId)
	// isBlocked = channelStore.isUserBlockedFromChannel(senderId)
}

async function unblockUser({ senderId, isBlocked }: { senderId: string; isBlocked: boolean }) {
	//TODO: get writable channel id
	// await channelStore.unblockUserFromChannel({
	//     channelId: channelStore.currentChannel._id,
	//     userId: senderId
	// })
	// channelStore.currentChannel.blockedUsers =
	//     channelStore.currentChannel.blockedUsers?.filter(
	//         (user) => !!(user != senderId)
	//     )
	// isBlocked = channelStore.isUserBlockedFromChannel(senderId)
}

async function showDeleteMessageDialog({ oneVone, message }: { oneVone: boolean; message: any }) {
	// const dialogData: DialogData = {
	//     title: 'Delete Message',
	//     message: 'Are you sure you want to delete this message?',
	//     okText: 'Yes',
	//     cancelText: 'Cancel'
	// }

	// const dialogRef = dialogService.openDialog(dialogData, {
	//     disableClose: true
	// })

	// dialogRef.afterClosed().subscribe((result) => {
	// if (result) {
	//TODO: show alert
	commitDeleteMessage({ oneVone, message })
	// }
	// })
}

async function commitDeleteMessage({ oneVone, message }: { oneVone: boolean; message: any }) {
	// let chan = null
	// if (oneVone || !channelStore.currentChannel) {
	//     chan = { _id: message.channelId } // if friend chat
	// } else {
	//     chan = channelStore.currentChannel // if channel chat
	// }
	// if (chan) {
	//     //TODO: get writable channel id
	//     deleteMessage({ message, channelId: chan._id })
	// }
}

export {
	// deleteMessage,
	// deleteAllMessages,
	postFile,
	deleteFile,
	getTrendingGifs,
	searchGifs,
	getMessages,
	sendChannelMessage,
	sendChatMessage,
	// emitChannelChatTypingByUser,
	createChat,
	getChat,
	getChats,
	deleteChat,
	updateChatProperties,
	incrementUnreadMessageCount,
	clearUnreadMessageCount,
	searchChats,
	openChat,
	activateChatTab,
	activateGroupTab,
	checkAlreadyExist,
	incomingMessageActivateChatTab,
	blockUser,
	unblockUser,
	showDeleteMessageDialog,
	commitDeleteMessage
}

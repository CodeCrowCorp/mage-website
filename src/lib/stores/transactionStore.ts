import { env } from '$env/dynamic/public'

async function createTransaction({
	url,
	type,
	amount,
	receiverId,
	receiverName,
	senderId,
	senderName,
	channelId
}: {
	url: string
	type: string
	amount: string
	receiverId: string
	receiverName: string
	senderId: string
	senderName: string
	channelId: string
}) {
	url = `https://explorer.solana.com/tx/${url}?cluster=devnet`
	const data = {
		channelId: channelId,
		url: url,
		date: new Date().toLocaleDateString(),
		receiverId: receiverId,
		receiverName: receiverName,
		senderId: senderId,
		senderName: senderName,
		amount: amount,
		type: type
	}
	return await fetch(`${env.PUBLIC_API_URL}/transactions`, {
		method: 'POST',
		body: JSON.stringify(data)
	}).then((response) => response.json())
}

//TODO: send userId through header
async function getTransactions() {
	return await fetch(`${env.PUBLIC_API_URL}/transactions`, {
		method: 'GET'
	}).then((response) => response.json())
}

export { createTransaction, getTransactions }

import { env } from '$env/dynamic/public'
import { getHeaders } from '$lib/stores/helperStore'

async function createTransaction({ url, type, amount, receiverId, receiverName, senderId, senderName, channelId }
    : { url: string, type: string, amount: string, receiverId: string, receiverName: string, senderId: string, senderName: string, channelId: string }) {
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
        body: JSON.stringify(data),
        headers: getHeaders()
    }).then(response => response.json())
}

//TODO: send userId through header
async function getTransactions() {
    return await fetch(`${env.PUBLIC_API_URL}/transactions`, {
        method: 'GET',
        headers: getHeaders()
    }).then(response => response.json())
}

export {
    createTransaction,
    getTransactions
}
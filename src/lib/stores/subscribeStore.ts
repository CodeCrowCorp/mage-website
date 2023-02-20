import { env } from '$env/dynamic/public'

async function createSubscribe({ source1, source2 }: { source1: string; source2: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/subscribe`, {
		method: 'PUT',
		body: JSON.stringify({ source1, source2 })
	}).then((response) => response.json())
}

async function getSubscribes({
	source,
	sourceType,
	searchQuery,
	skip,
	limit
}: {
	source: string
	sourceType: string
	searchQuery: string
	skip: string
	limit: string
}) {
	return await fetch(
		`${env.PUBLIC_API_URL}/subscribe?source=${source}&sourceType=${sourceType}&searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`,
		{
			method: 'GET'
		}
	).then((response) => response.json())
}

async function getSubscribeCount({ source, sourceType }: { source: string; sourceType: string }) {
	return await fetch(
		`${env.PUBLIC_API_URL}/subscribe/count?source=${source}&sourceType=${sourceType}`,
		{
			method: 'GET'
		}
	).then((response) => response.json())
}

async function deleteSubscribe({ source1, source2 }: { source1: string; source2: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/subscribe?source1=${source1}&source2=${source2}`, {
		method: 'DELETE'
	}).then((response) => response.json())
}

async function getSubscribeRelationship({ source }: { source: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/subscribe/relationship?source=${source}`, {
		method: 'GET'
	}).then((response) => response.json())
}

async function toggleSubscribe({
	subscribe,
	senderId,
	userId
}: {
	subscribe: any
	senderId: string
	userId: string
}) {
	if (subscribe) {
		if (!subscribe.isSubscribing) {
			await createSubscribe({
				source1: senderId,
				source2: userId
			})
			subscribe.isSubscribing = true
		} else {
			await deleteSubscribe({
				source1: senderId,
				source2: userId
			})
			subscribe.isSubscribing = false
		}
	}
}

export {
	createSubscribe,
	getSubscribes,
	getSubscribeCount,
	deleteSubscribe,
	getSubscribeRelationship,
	toggleSubscribe
}

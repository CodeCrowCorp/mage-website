import { env } from '$env/dynamic/public'
import { getHeaders } from '$lib/stores/helperStore'

async function createFunFact({ funFactText }: { funFactText: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/fun-facts`, {
		method: 'PUT',
		body: JSON.stringify({ funFactText }),
		headers: getHeaders()
	}).then((response) => response.json())
}

async function deleteFunFact({ funFactId }: { funFactId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/fun-facts?funFactId=${funFactId}`, {
		method: 'DELETE',
		headers: getHeaders()
	}).then((response) => response.json())
}

async function getRandomFunFact() {
	return await fetch(`${env.PUBLIC_API_URL}/fun-facts/random`, {
		method: 'GET',
		headers: getHeaders()
	}).then((response) => response.json())
}

async function getFunFacts({
	searchQuery,
	skip,
	limit
}: {
	searchQuery: string
	skip: string
	limit: string
}) {
	return await fetch(
		`${env.PUBLIC_API_URL}/fun-facts?searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`,
		{
			method: 'GET',
			headers: getHeaders()
		}
	).then(async (response) => {
		const funFactsWithCount = await response.json()
		if (!funFactsWithCount || !funFactsWithCount['total']) {
			if (searchQuery) {
				// this.snackBar.open('No results with the search criteria', null, {
				//     duration: 2000
				// })
			}
		}
		return {
			funFacts: funFactsWithCount['funFacts'],
			total: funFactsWithCount['total']
		}
	})
}

export { createFunFact, deleteFunFact, getRandomFunFact, getFunFacts }

import { PUBLIC_API_URL } from '$env/static/public'

class FunFactStore {
    public async createFunFact({ funFactText }: { funFactText: string }) {
        return await fetch(`${PUBLIC_API_URL}/fun-facts`, {
            method: 'PUT',
            body: JSON.stringify({ funFactText })
        }).then(response => response.json())
    }

    public async deleteFunFact({ funFactId }: { funFactId: string }) {
        return await fetch(`${PUBLIC_API_URL}/fun-facts?funFactId=${funFactId}`, {
            method: 'DELETE'
        }).then(response => response.json())
    }

    public async getRandomFunFact() {
        return await fetch(`${PUBLIC_API_URL}/fun-facts/random`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getFunFacts({ searchQuery, skip, limit }: { searchQuery: string, skip: string, limit: string }) {
        return await fetch(`${PUBLIC_API_URL}/fun-facts?searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`, {
            method: 'GET'
        }).then(async response => {
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
}

export const funFactStore = new FunFactStore()
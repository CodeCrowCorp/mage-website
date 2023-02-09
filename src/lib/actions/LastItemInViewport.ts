type Event = 'loadMore'

const createEvent = (name: Event) => new CustomEvent(name)

const options = {
	root: null,
	rootMargin: '0px',
	threshold: 0
}

export default function (node: HTMLElement) {
	const observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) {
			if (!node.nextSibling) {
				node.dispatchEvent(createEvent('loadMore'))
			}
		}
	}, options)
	observer.observe(node)

	return {
		destroy() {
			return
		}
	}
}

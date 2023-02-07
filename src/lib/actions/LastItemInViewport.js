let options = {
	root: null,
	rootMargin: '0px',
	threshold: 0
}

export default function (node) {
	const observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) {
			if (!node.nextSibling) {
				node.dispatchEvent(new CustomEvent('load_more'))
			}
		}
	}, options)
	observer.observe(node)

	return {
		destroy() {}
	}
}

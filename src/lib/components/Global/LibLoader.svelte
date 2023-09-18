<script lang="ts">
	// Based on code from https://stackoverflow.com/questions/59629947/how-do-i-load-an-external-js-library-in-svelte-sapper
	import { onMount, createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
	export let src: string, libraryDetectionObject: any
	let script: any
	let library: any // Variable to store the library object

	onMount(() => {
		if (libraryDetectionObject && window && typeof window[libraryDetectionObject] !== 'undefined') {
			return dispatch('loaded')
		}
		script.addEventListener('load', () => {
			library = window[libraryDetectionObject] // Assign the library object to the variable
			// console.log('load event from script')
			dispatch('loaded', { library })
		})
		script.addEventListener('error', (event: any) => {
			console.error('something went wrong', event)
			dispatch('error')
		})
	})
</script>

<svelte:head>
	<script bind:this={script} {src}>
	</script>
</svelte:head>

<script>
	import { current_theme } from '$lib/stores/helperStore'
	import { onMount } from 'svelte'

	export let customClass = 'w-5'

	let color = '#fff'
	onMount(() => {
		current_theme.subscribe((theme) => {
			switch (theme) {
				case 'dark':
				case 'synthwave':
					color = '#fff'
					break
				case 'light':
				case 'cyberpunk':
					color = '#000'
					break
			}
		})
	})
</script>

<div class={customClass}>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" style="fill: {color};">
		<path
			d="M 14.878906 10.582031 L 24.183594 0 L 21.980469 0 L 13.898438 9.1875 L 7.445312 0 L 0 0 L 9.761719 13.890625 L 0 24.988281 L 2.207031 24.988281 L 10.738281 15.285156 L 17.554688 24.988281 L 25 24.988281 Z M 11.859375 14.015625 L 10.867188 12.632812 L 3 1.625 L 6.386719 1.625 L 12.738281 10.507812 L 13.726562 11.890625 L 21.980469 23.4375 L 18.59375 23.4375 Z M 11.859375 14.015625 " />
	</svg>
</div>

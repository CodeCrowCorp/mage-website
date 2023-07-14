<script>
	import { current_theme } from '$lib/stores/helperStore'
	import { onMount } from 'svelte'

	export let customClass = 'w-20'

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
					color = '#3b0f7f'
					break
			}
		})
	})
</script>

<div class={customClass}>
	<svg
		data-name="Layer 1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 514.34 814.7"
		style="fill: {color};">
		<path
			class="prefix__cls-1"
			d="M486.58 704.69c4.28 5.69 14.78 55.16 14.78 55.16s10.54-49.47 14.8-55.16S557.71 685 557.71 685s-37.28-13.93-41.55-19.59-14.8-55.18-14.8-55.18-10.52 49.5-14.78 55.18S445 685 445 685s37.29 14 41.58 19.69z"
			transform="translate(-242.83 -92.65)" />
		<path
			class="prefix__cls-1"
			d="M132.51 597.21l79.18-107.68-40.46-116.56 99.26-191.14L65.11 386.44l41.01 107.23L0 597.21 247.9 814.7 132.51 597.21z" />
		<path
			class="prefix__cls-1"
			d="M378.52 341.17l51.65-117.07L299.25 0l57.78 180.74-68.47 151.25 100.03 223.79L247.9 814.7l266.44-248.57-135.82-224.96z" />
	</svg>
</div>

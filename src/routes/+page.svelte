<script>
	import { onMount } from 'svelte'
	import { themeChange } from 'theme-change'

	onMount(() => {
		themeChange(false)
	})
</script>

<div class="relative overflow-hidden">
	<div
		class="container relative space-y-20 mt-12 mb-20 sm:space-y-24 sm:my-24 lg:space-y-32 lg:my-32 ml-auto mr-auto">
		<h1>Welcome to SvelteKit</h1>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
		<input
			type="checkbox"
			class="toggle"
			id="theme-toggle"
			data-toggle-theme="light,dark"
			data-act-class="ACTIVECLASS" />
	</div>
</div>

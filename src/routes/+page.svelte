<script>
	//import { PUBLIC_PRODUCTION } from '$env/static/public';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	onMount(() => {
		themeChange(false);
		// false parameter is required for svelte
	});
</script>

<div class="relative overflow-hidden">
	<div
		class="container relative space-y-20 mt-12 mb-20 sm:space-y-24 sm:my-24 lg:space-y-32 lg:my-32 ml-auto mr-auto"
	>
		<h1 class="nre-text">Welcome to SvelteKit</h1>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
		<input
			type="checkbox"
			class="toggle"
			id="theme-toggle"
			data-toggle-theme="light,dark"
			data-act-class="ACTIVECLASS"
		/>
	</div>
</div>

<style>
	.nre-text {
		font-family: 'Montserrat';
		font-style: normal;
		font-weight: 800;
		font-size: 110px;
		line-height: 134px;
		display: flex;
		align-items: center;
		letter-spacing: 0.35px;
		text-transform: uppercase;
		-webkit-text-stroke: 6px #ffffff;
	}
</style>

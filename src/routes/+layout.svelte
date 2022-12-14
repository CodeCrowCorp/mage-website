<script>
	import '$lib/assets/styles/tailwind-output.css';
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
		rel="stylesheet"
	/>
</svelte:head>

<slot />

<style global>
	:root {
		--color-default: #ffffff;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--my-color: #25252a;
		}
	}
	[data-theme='dark'] {
		--color-default: #25252a;
	}
	[data-theme='light'] {
		--my-color: #ffffff;
	}
	body {
		background-color: var(--color-default);
	}
</style>

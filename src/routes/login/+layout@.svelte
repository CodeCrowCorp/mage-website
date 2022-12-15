<script>
	import Header from '$lib/components/LandingPage/Header.svelte';
	import Footer from '$lib/components/LandingPage/Footer.svelte';
</script>

<div>
	<Header />

	<slot />

	<Footer />
</div>

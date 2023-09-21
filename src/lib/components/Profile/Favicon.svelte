<script lang="ts">
	import IconLink from '$lib/assets/icons/IconLink.svelte'

	export let url: string
	let faviconUrl = ''

	async function fetchFavicon() {
		try {
			faviconUrl = `https://www.google.com/s2/favicons?domain=${url}`
		} catch (error) {
			faviconUrl = ''
		}
	}

	import { onMount } from 'svelte'
	onMount(fetchFavicon)
</script>

{#if faviconUrl}
	<a class="link link-info" href={url} target="_blank" rel="noreferrer">
		<img class='w-4 h-4' src={faviconUrl} alt="Favicon" />
	</a>
{:else}
	<a class="link link-info" href={url} target="_blank" rel="noreferrer">
		<IconLink />
	</a>
{/if}

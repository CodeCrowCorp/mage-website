<script lang="ts">
	import IconLink from '$lib/assets/icons/IconLink.svelte'
	import { onMount } from 'svelte'

	export let url: string
	let faviconUrl = ''

	const fetchFavicon = async () => {
		try {
			faviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256`
		} catch (error) {
			faviconUrl = ''
		}
	}

	onMount(fetchFavicon)
</script>

{#if faviconUrl}
	<a class="link link-info w-10 tooltip" href={url} data-tip={url} target="_blank" rel="noreferrer">
		<img class="w-full" src={faviconUrl} alt="Favicon" />
	</a>
{:else}
	<a class="w-10 h-10 link link-info tooltip" href={url} data-tip={url} target="_blank" rel="noreferrer">
		<IconLink />
	</a>
{/if}

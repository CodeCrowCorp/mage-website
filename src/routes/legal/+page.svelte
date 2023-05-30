<script lang="ts">
	let activeTab = 0
	const post = [
		{
			name: 'Privacy Policy',
			url: 'https://legal.mage.stream/privacy.pdf'
		},
		{
			name: 'Cookie Policy',
			url: 'https://legal.mage.stream/cookie.pdf'
		},
		{
			name: 'Copyright Policy',
			url: 'https://legal.mage.stream/copyright.pdf'
		},
		{ name: 'GDPR Policy', url: 'https://legal.mage.stream/gdpr.pdf' },
		{
			name: 'Terms of Service',
			url: 'https://legal.mage.stream/terms.pdf'
		}
	]
</script>

<div class="h-screen flex justify-center flex-col">
	<div class="tabs tabs-boxed flex justify-center">
		{#each post as doc, index}
			<button class="tab" class:tab-active={activeTab == index} on:click={() => (activeTab = index)}
				>{doc.name}</button>
		{/each}
	</div>
	<iframe class="flex-auto h-full" title="legal" src={post[activeTab].url} />
</div>

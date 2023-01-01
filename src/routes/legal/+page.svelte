<script>
	let tabs = [
		"Privacy Policy",
		"Cookie Policy",
		"Copyright Policy",
		"GDPR Policy",
		"Terms of Service"
	]
	let activeTab = 0
</script>
<div class="h-screen flex justify-center flex-col">
	<div class="tabs tabs-boxed flex justify-center">
		{#each tabs as tab, index}
		  <button class="tab" class:tab-active={activeTab == index} on:click={()=>activeTab = index}>{tab}</button>
		{/each}
	</div>
	<iframe class="flex-auto h-full" title='legal' src="https://code-crow-legal-docs.s3.amazonaws.com/legal/privacy.pdf"></iframe>
</div>
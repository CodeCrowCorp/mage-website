<script lang="ts">
	import IconEmail from '$lib/assets/icons/contact/IconEmail.svg'
	import IconSocialDiscordInverse from '$lib/assets/icons/contact/IconSocialDiscordInverse.svg'
</script>

<div class="m-10 lg:w-2/5 bg-primary p-16 rounded-md">
	<h1 class="text-4xl pb-4 text-white font-bold">Get in touch</h1>
	<p class="text-xl text-white pb-8 leading-relaxed font-normal pr-4">
		Got a question about us? Are you interested in partnering with us? Have some suggestions or just
		want to say hi? Just contact us. We are here to asset you.
	</p>
	<div class="flex items-center">
		<div aria-label="email icon" role="img">
			<img class="w-7" src={IconEmail} alt="" />
		</div>
		<p class="pl-4 text-white text-base">
			<a class="link" href="mailto: support@codecrow.io" target="_blank" rel="noreferrer"
				>support@codecrow.io</a>
		</p>
	</div>
	<div class="flex items-center mt-2">
		<div aria-label="email icon" role="img">
			<img class="w-7" src={IconSocialDiscordInverse} alt="" />
		</div>
		<p class="pl-4 text-white text-base">
			<a class="link" href="https://discord.gg/CodeCrow" target="_blank" rel="noreferrer"
				>Create a support ticket in our discord</a>
		</p>
	</div>
	<p class="text-lg text-white pt-10 tracking-wide">
		16192 Coastal Highway
		<br />
		Lewes, DE 19958 United States
	</p>
	<div class=" pt-16">
		<a
			href="/careers"
			class="text-white font-bold tracking-wide underline focus:outline-none focus:ring-2 focus:ring-white ">
			View Job Openings</a>
	</div>
</div>

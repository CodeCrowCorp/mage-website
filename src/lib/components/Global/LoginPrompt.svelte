<script lang="ts">
	import IconSocialDiscordInverse from '$lib/assets/icons/social/IconSocialDiscordInverse.svelte'
	import IconSocialGoogle from '$lib/assets/icons/social/IconSocialGoogle.svelte'
	import IconSocialGitHubInverse from '$lib/assets/icons/social/IconSocialGitHubInverse.svelte'
	import { env } from '$env/dynamic/public'
	import { is_login_modal_open } from '$lib/stores/helperStore'
	import IconMageLogo from '$lib/assets/icons/IconMageLogo.svelte'
	import { getHref } from '$lib/utils'
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="modal cursor-pointer {$is_login_modal_open ? 'modal-open' : ''}"
	on:click={() => {
		$is_login_modal_open = false
	}}>
	<div
		class="modal-box relative"
		on:click={(e) => {
			e.stopPropagation()
		}}>
		<div class="py-4 space-y-5 px-4 md:px-10">
			<div class="flex justify-center">
				<IconMageLogo customClass={'w-20 mage-text hidden md:block'} />
			</div>
			{#if env.PUBLIC_CROSS_ORIGIN === 'false'}
				<a
					class="btn w-full bg-indigo-700 hover:bg-indigo-900 text-white gap-4 border-none"
					href="{env.PUBLIC_API_URL}/auth/discord">
					<IconSocialDiscordInverse />
					Log in with Discord</a>
				<a class="btn w-full btn-outline gap-4" href="{env.PUBLIC_API_URL}/auth/google">
					<IconSocialGoogle />
					Log in with Google</a>
				<a
					class="btn w-full bg-black hover:bg-gray-800 text-white gap-4 border-none"
					href="{env.PUBLIC_API_URL}/auth/github">
					<IconSocialGitHubInverse />
					Log in with GitHub</a>
			{:else}
				<button
					class="btn w-full bg-indigo-700 hover:bg-indigo-900 text-white gap-4 border-none"
					on:click={async () =>
						await getHref({
							provider: 'discord',
							apiUrl: env.PUBLIC_API_URL,
							xApiKey: env.PUBLIC_X_API_KEY
						})}>
					<IconSocialDiscordInverse />
					Log in with Discord</button>
				<button
					class="btn w-full btn-outline gap-4"
					on:click={async () =>
						await getHref({
							provider: 'google',
							apiUrl: env.PUBLIC_API_URL,
							xApiKey: env.PUBLIC_X_API_KEY
						})}>
					<IconSocialGoogle />
					Log in with Google</button>
				<button
					class="btn w-full bg-black hover:bg-gray-800 text-white gap-4 border-none"
					on:click={async () =>
						await getHref({
							provider: 'github',
							apiUrl: env.PUBLIC_API_URL,
							xApiKey: env.PUBLIC_X_API_KEY
						})}>
					<IconSocialGitHubInverse />
					Log in with GitHub</button>
			{/if}
			<p>
				By using our platform, you confirm that you are atleast 18 years old and agree to
				<a class="link link-info" href="https://codecrow.io/legal" target="_blank"
					>all of our policies
				</a>
			</p>
		</div>
	</div>
</div>

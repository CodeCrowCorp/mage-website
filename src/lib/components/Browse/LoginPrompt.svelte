<script>
	import IconSocialDiscordInverse from '$lib/assets/icons/social/IconSocialDiscordInverse.svelte'
	import IconSocialGoogle from '$lib/assets/icons/social/IconSocialGoogle.svelte'
	import IconSocialGitHubInverse from '$lib/assets/icons/social/IconSocialGitHubInverse.svelte'
	import { PUBLIC_API_URL } from '$env/static/public'
	import { getGitHubUrl, getDiscordUrl, getGoogleUrl } from '$lib/utils/authUrl'
</script>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-4" class="modal-toggle" />
<label for="my-modal-4" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<div class="py-4 space-y-5 px-10">
			<a class="btn w-full btn-primary gap-4" href={getDiscordUrl('/auth/discord')}>
				<IconSocialDiscordInverse />
				Log in with Discord</a>
			<a class="btn w-full btn-outline gap-4" href={getGoogleUrl('/auth/google')}>
				<IconSocialGoogle />
				Log in with Google</a>
			<a class="btn w-full bg-black gap-4" href={getGitHubUrl('/auth/github')}>
				<IconSocialGitHubInverse />
				Log in with GitHub</a>
			<p>
				By using our platform, you confirm that you are atleast 18 years old and agree to
				<a class="link link-info" href="/legal">all of our policies </a>
			</p>
		</div>
	</label>
</label>

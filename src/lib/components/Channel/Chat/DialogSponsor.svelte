<script lang="ts">
	import { page } from '$app/stores'
	import { env } from '$env/dynamic/public'
	import { post } from '$lib/api'
	import { is_sponsor_dialog_open } from '$lib/stores/channelStore'
	import { is_feature_premium_enabled } from '$lib/stores/remoteConfigStore'
	import { onMount } from 'svelte'
	import { loadStripe } from '@stripe/stripe-js'
	import { EmbeddedCheckout } from 'svelte-stripe'

	export let profile: any

	let selectedDuration = 1
	let step = 1

	let stripe: any = null,
		clientSecret: string = ''

	onMount(async () => {
		stripe = await loadStripe(env.PUBLIC_STRIPE_KEY || '')
	})

	const showCheckoutDialog = async () => {
		clientSecret = await post(
			`plan/sponsor-session`,
			{
				recipientUserId: profile._id,
				numOfMonths: selectedDuration,
				returnUrl: window.location.href
			},
			{ userId: $page.data.user?.userId, token: $page.data.user?.token }
		)
	}
</script>

{#if $is_feature_premium_enabled}
	<dialog class={`modal ${$is_sponsor_dialog_open && 'modal-open'}`}>
		<div class="modal-box max-w-fit">
			<h3 class="font-bold text-lg">
				Sponsor <span class="text-secondary">@{profile.username || ''}</span>
			</h3>
			<p class="py-4">
				Streamers work hard to provide entertaining and helpful content. You can be their sponsor
				and encourage them!
			</p>
			{#if step === 1}
				<span class="flex mt-1 font-semibold">Choose number of months to sponsor for:</span>
				{#each [1, 3, 6] as duration (duration)}
					<input type="radio" class="hidden" bind:group={selectedDuration} value={duration} />
					<button
						class={selectedDuration === duration ? 'btn btn-accent' : 'btn btn-neutral btn-outline'}
						on:click={() => (selectedDuration = duration)}>
						{duration === 1 ? `${duration} month` : `${duration} months`}
					</button>
				{/each}
			{:else if step === 2}
				<div class="mb-3">
					Selected duration:
					<button class="btn btn-accent">
						{selectedDuration === 1 ? `${selectedDuration} month` : `${selectedDuration} months`}
					</button>
				</div>
				<EmbeddedCheckout {stripe} {clientSecret} />
			{/if}
			<div class="modal-action">
				<form method="dialog">
					<button
						class="btn"
						on:click={() => {
							step > 1 ? (step = 1) : ($is_sponsor_dialog_open = !$is_sponsor_dialog_open)
						}}>{step > 1 ? 'Back' : 'Close'}</button>
					<button
						class="btn btn-accent"
						disabled={step === 2}
						on:click={async () => {
							step = 2
							await showCheckoutDialog()
						}}>Next</button>
				</form>
			</div>
		</div>
	</dialog>
{/if}

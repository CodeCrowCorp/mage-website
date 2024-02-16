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

	let stripe: any = null,
		clientSecret: string = ''

	onMount(async () => {
		stripe = await loadStripe(env.PUBLIC_STRIPE_KEY || '')
	})

	const showCheckoutDialog = async () => {
		clientSecret = await post(
			`plan/sponsor`,
			{ recipientId: profile._id, numOfMonths: selectedDuration },
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
			<ul class="steps mb-2 w-full">
				<li class="step step-primary">Choose plan</li>
				<li class="step">Purchase</li>
				<li class="step">Done</li>
			</ul>
			<span class="flex mt-1 font-semibold">Sponsor for:</span>
			{#each [1, 3, 6] as duration (duration)}
				<input type="radio" class="hidden" bind:group={selectedDuration} value={duration} />
				<button
					class={selectedDuration === duration ? 'btn btn-accent' : 'btn btn-neutral btn-outline'}
					on:click={() => (selectedDuration = duration)}>
					{duration === 1 ? `${duration} month` : `${duration} months`}
				</button>
			{/each}
			<EmbeddedCheckout {stripe} {clientSecret} />
			<div class="modal-action">
				<form method="dialog">
					<button class="btn" on:click={() => ($is_sponsor_dialog_open = !$is_sponsor_dialog_open)}
						>Close</button>
					<button class="btn btn-accent" on:click={async () => await showCheckoutDialog()}
						>Sponsor</button>
				</form>
			</div>
		</div>
	</dialog>
{/if}

<script lang="ts">
	import { onMount } from 'svelte'
	import { themeChange } from 'theme-change'
	import type { ActionData } from './$types'
	import Toast from '$lib/components/Global/Toast.svelte'
	import { enhance } from '$app/forms'
	import { current_theme } from '$lib/stores/helperStore'

	export let form: ActionData

	// $: email = $page.data.user.user.email

	let themes = ['dark', 'light'] //, 'cyberpunk', 'synthwave']

	onMount(() => {
		themeChange(false)
	})
</script>

<div class="flex justify-center h-screen bg-neutral py-10">
	<div class="text-center w-fit">
		<h1 class="text-5xl font-bold">Settings</h1>
		<!-- <div class="py-6">
			<form
				method="POST"
				action="?/update-email"
				use:enhance={() => {
					return async ({ update }) => {
						await update({ reset: false })
					}
				}}>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Enter your email to receive the latest news</span>
					</label>
					<label class="input-group">
						<span>Email</span>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="nerf-this@gamer.com"
							class="input input-bordered input-primary w-72"
							value={email || ''} />
						<button class="btn btn-primary">Save</button>
					</label>
					{#if form?.success}
						<Toast message="Email updated successfully" type="success" />
					{:else}
						<Toast message="Error updating email" type="error" />
					{/if}
				</div>
			</form>
		</div> -->

		<div class="flex flex-col border-opacity-50">
			<div class="divider">Theming</div>
			{#each themes as theme}
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">{theme}</span>
						<input
							type="radio"
							name="radio-10"
							class="radio radio-accent"
							checked={$current_theme === theme}
							data-toggle-theme={theme}
							data-act-class="ACTIVECLASS"
							on:change={() => {
								$current_theme = theme
							}} />
					</label>
				</div>
			{/each}
		</div>
	</div>
</div>

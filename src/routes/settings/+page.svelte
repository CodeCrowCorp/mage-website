<script lang="ts">
	import { onMount } from 'svelte'
	import { themeChange } from 'theme-change'
	import { current_theme } from '$lib/stores/helperStore'

	let themes = ['dark', 'light'] //, 'cyberpunk', 'synthwave']

	onMount(() => {
		themeChange(false)
	})
</script>

<div class="flex justify-center h-screen bg-base-200 py-10">
	<div class="text-center w-fit">
		<h1 class="text-5xl font-bold">Settings</h1>
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

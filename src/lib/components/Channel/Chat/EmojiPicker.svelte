<script lang="ts">
	import { onMount } from 'svelte'
	import IconChatEmoji from '$lib/assets/icons/chat/IconChatEmoji.svelte'

	export let onSelect: any

	let container: any

	onMount(async () => {
		// Picker:
		const { Picker } = await import('emoji-picker-element')
		const picker = new Picker({
			locale: 'en'
		})

		container.appendChild(picker)
		if (onSelect) picker.addEventListener('emoji-click', (event) => onSelect(event.detail.unicode))
	})
</script>

<div class="dropdown dropdown-top">
	<button
		tabindex="0"
		type="button"
		class="btn btn-neutral text-white border-none tooltip font-normal normal-case"
		data-tip="Emoji">
		<IconChatEmoji />
		<span class="sr-only">Add emoji</span>
	</button>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		bind:this={container}
		tabindex="0"
		class={'dropdown-content menu shadow bg-base-100 rounded-box emoji-container'} />
</div>

<style global>
	emoji-picker {
		margin-left: -70px;
	}
</style>

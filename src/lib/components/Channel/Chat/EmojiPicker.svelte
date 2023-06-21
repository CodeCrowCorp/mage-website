<script lang="ts">
	import { onMount } from 'svelte'
	import FloatingMenu from './FloatingMenu.svelte'
	import IconChatEmoji from '$lib/assets/icons/chat/IconChatEmoji.svelte'

	export let onSelect: any

	let container: any
	let btn: any
	let isFocused = false

	onMount(async () => {
		// Picker:
		const { Picker } = await import('emoji-picker-element')
		const picker = new Picker({
			locale: 'en'
		})

		container.appendChild(picker)
		if (onSelect)
			picker.addEventListener('emoji-click', (event) => {
				onSelect(event.detail.unicode)
			})

		if (btn) {
			btn.addEventListener('focus', () => {
				isFocused = true
			})
		}
	})
</script>

<FloatingMenu id="emoji-picker" icon={IconChatEmoji} label="Emoji">
	<div bind:this={container} />
</FloatingMenu>

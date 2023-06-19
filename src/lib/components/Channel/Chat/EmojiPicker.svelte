<script lang="ts">
	import { onMount } from 'svelte'
	import IconChatEmoji from '$lib/assets/icons/chat/IconChatEmoji.svelte'
	import { clickOutside } from '../../../utils.js';

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
		if (onSelect) picker.addEventListener('emoji-click', (event) =>{
			onSelect(event.detail.unicode)
		})

		if(btn){
			btn.addEventListener("focus", () => {
				isFocused = true
			})
		}
	})

	const handleClickOutside = () =>{
		isFocused = false
	}

	$: btnClass = isFocused ? "btn-primary" : "btn-neutral"

</script>

<div use:clickOutside={handleClickOutside} class="dropdown dropdown-top">
	<button
		bind:this={btn}
		tabindex="0"
		type="button"
		class={"btn text-white border-none tooltip font-normal normal-case " + btnClass}
		data-tip="Emoji"
	>
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

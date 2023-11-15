<script lang="ts">
	import { page } from '$app/stores'
	import { clickOutside } from '$lib/utils'
	export let id: string = 'float-menu'
	export let icon: any = null
	export let label: string = '',
		isChannelSocketConnected: any

	let btn: any
	let isFocused = false

	const handleClickOutside = (event: any) => {
		const _id =
			event.target?.id ||
			event.target.parentElement?.id ||
			event.target.parentElement?.parentElement?.id

		if (id !== _id) isFocused = false
	}

	const forceClose = () => {
		isFocused = false
	}

	$: btnClass = isFocused ? 'btn-primary' : 'btn-neutral'
	$: dropdownClass = isFocused ? 'dropdown-open' : ''
	$: bottom = btn ? window.innerHeight - btn.getBoundingClientRect().top : 0
</script>

<button
	bind:this={btn}
	{id}
	type="button"
	class={'btn border-none tooltip font-normal normal-case ' + btnClass}
	data-tip={label}
	on:click={() => {
		isFocused = true
	}}
	disabled={!isChannelSocketConnected || !$page.data.user?.userId}>
	<svelte:component this={icon} {id} />
	<span class="sr-only">Add emoji</span>
</button>
<div use:clickOutside={handleClickOutside} class={'dropdown dropdown-top ' + dropdownClass}>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		style="bottom: {bottom}px"
		class={'dropdown-content menu shadow !fixed right-0 z-50 floating-menu overflow-auto'}>
		<slot {forceClose} />
	</div>
</div>

<style>
	.floating-menu {
		max-width: 100vw;
	}
</style>

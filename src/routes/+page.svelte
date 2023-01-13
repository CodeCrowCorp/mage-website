<script>
	import IconLaunch from '../lib/assets/icons/IconLaunch.svelte'
	import LoginPrompt from '../lib/components/Browse/LoginPrompt.svelte'
</script>

<div class="hero min-h-screen flex justify-center">
	<!-- The button to open modal -->
	<label for="my-modal-4" class="btn btn-primary gap-4"> <IconLaunch /> Launch dApp</label>

	<LoginPrompt />
</div>

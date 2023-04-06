<script lang="ts">
	export let id: string,
		title: string,
		message: string,
		no: string,
		noAction: () => void,
		yes: string,
		yesAction: () => Promise<any>,
		isError: boolean = false
</script>

<label for={id} class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">{title}</h3>
		<p class="py-4">
			{message}
		</p>
		<div class="modal-action">
			<button on:click={() => noAction()} class="btn">{no}</button>
			<button
				on:click={async () => await yesAction()}
				class="btn {isError ? 'btn-error' : 'btn-primary'}">{yes}</button>
		</div>
	</label>
</label>

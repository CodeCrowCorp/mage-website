<script lang="ts">
	export let message: string, type: string
</script>

<div class="toast toast-end">
	<div class="alert alert-{type}">
		<div>
			<span>{message}</span>
		</div>
	</div>
</div>

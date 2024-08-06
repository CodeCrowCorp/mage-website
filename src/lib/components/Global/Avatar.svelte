<script lang="ts">
	export let avatar, username, className
	let imgElement: HTMLImageElement
</script>

<img
	bind:this={imgElement}
	class={className}
	loading="lazy"
	src={avatar}
	alt="user avatar"
	on:error={() =>
		(imgElement.src = `https://ui-avatars.com/api/?name=${username}&background=random`)} />

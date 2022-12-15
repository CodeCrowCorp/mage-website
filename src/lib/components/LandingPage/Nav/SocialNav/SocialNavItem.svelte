<script lang="ts">
	export let link: string, image: string;
</script>

<li class="mx-2.5">
	<a href={link} target="_blank" rel="noreferrer">
		<img src={image} alt="Social Link" />
	</a>
</li>

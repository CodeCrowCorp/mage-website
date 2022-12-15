<script lang="ts">
	export let title: string,
		link: string,
		bgColor: string,
		border: string,
		startIcon = '',
		endIcon = '',
		addClass = '';
</script>

<a
	href={link}
	class="btn uppercase gap-2 px-6 py-2 rounded text-white font-medium text-[13px] leading-[18px] tracking-[0.35px] {bgColor} {border} {addClass}"
	target="_blank"
	rel="noreferrer"
>
	<img src={startIcon} alt="" />
	{title}
	<img src={endIcon} alt="" />
</a>

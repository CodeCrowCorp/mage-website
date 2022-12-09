<script lang="ts">
	export let title: string,
		link: string,
		titleColor: string,
		border: string,
		startIcon = '',
		endIcon = '',
		addClass = '';
</script>

<a
	href={link}
	class="btn uppercase gap-2 px-6 py-2 rounded bg-transparent hover:bg-transparent font-medium text-[13px] leading-[18px] tracking-[0.35px] {titleColor} {border} {addClass}"
	target="_blank"
	rel="noreferrer"
>
	<img src={startIcon} alt="" />
	{title}
	<img src={endIcon} alt="" />
</a>

<script lang="ts">
	export let title: string,
		bgColor: string,
		border: string,
		startIcon = '',
		endIcon = '',
		addClass = '';
</script>

<button
	class="btn uppercase gap-2 px-6 py-2 rounded text-white font-medium text-[13px] leading-[18px] tracking-[0.35px] {bgColor} {border} {addClass}"
>
	<img src={startIcon} alt="" />
	{title}
	<img src={endIcon} alt="" />
</button>

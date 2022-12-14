<script lang="ts">
	import PhaseCard from '$lib/components/LandingPage/Roadmap/PhaseCard.svelte';

	import reloadLogo from '$lib/assets/images/roadmap/Reload-logo.svg';
	import crossLogo from '$lib/assets/images/roadmap/cross.svg';
	import solanaLogo from '$lib/assets/images/roadmap/solana-sol-logo.svg';

	import playStoreLogo from '$lib/assets/images/roadmap/Google-Play.svg';
	import appStoreLogo from '$lib/assets/images/roadmap/App-Store.svg';

	const phases = {
		phaseOne: [
			'Build the community',
			'Collaborate with an animation studio for our MVP Heroes NFT animations',
			'Begin infinibuild development',
			'Allow 1 million viewers per channel',
			'Integrate User Profiles to allow users to establish their brand'
		],
		phaseTwo: [
			'Build the community',
			'Collaborate with an animation studio for our MVP Heroes NFT animations',
			'Begin infinibuild development',
			'Allow 1 million viewers per channel',
			'Integrate User Profiles to allow users to establish their brand'
		],
		phaseThree: [
			'Build the community',
			'Collaborate with an animation studio for our MVP Heroes NFT animations',
			'Begin infinibuild development',
			'Allow 1 million viewers per channel',
			'Integrate User Profiles to allow users to establish their brand'
		],
		phaseFour: [
			'Build the community',
			'Collaborate with an animation studio for our MVP Heroes NFT animations',
			'Begin infinibuild development',
			'Allow 1 million viewers per channel',
			'Integrate User Profiles to allow users to establish their brand'
		],
		phaseFive: [
			'Build the community',
			'Collaborate with an animation studio for our MVP Heroes NFT animations',
			'Begin infinibuild development',
			'Allow 1 million viewers per channel',
			'Integrate User Profiles to allow users to establish their brand'
		]
	};
</script>

<PhaseCard title="Phase 1" headBgColorClass="bg-[#EC008C]" dotColorClass="after:bg-[#EC008C]">
	<ul class="list-disc" slot="cardContent">
		{#each phases.phaseOne as item}
			<li>{item}</li>
		{/each}
	</ul>
</PhaseCard>

<PhaseCard
	title="Phase 2"
	rightCard={true}
	headBgColorClass="bg-[#C8198B]"
	dotColorClass="after:bg-[#C8198B]"
>
	<ul class="list-disc" slot="cardContent">
		{#each phases.phaseTwo as item}
			<li>{item}</li>
		{/each}
	</ul>
</PhaseCard>

<PhaseCard title="Phase 3" headBgColorClass="bg-[#8A388A]" dotColorClass="after:bg-[#8A388A]">
	<ul class="list-disc" slot="cardContent">
		{#each phases.phaseThree as item}
			<li>{item}</li>
		{/each}
	</ul>
	<div class="flex flex-row" slot="extraContent">
		<img src={reloadLogo} class="w-20" alt="" />
		<img src={crossLogo} class="w-20 px-6" alt="" />
		<img src={solanaLogo} class="w-20" alt="" />
	</div>
</PhaseCard>

<PhaseCard
	title="Phase 4"
	rightCard={true}
	headBgColorClass="bg-[#4E3388]"
	dotColorClass="after:bg-[#4E3388]"
>
	<ul class="list-disc" slot="cardContent">
		{#each phases.phaseFour as item}
			<li>{item}</li>
		{/each}
	</ul>
</PhaseCard>

<PhaseCard title="Phase 5" headBgColorClass="bg-[#2B328C]" dotColorClass="after:bg-[#2B328C]">
	<ul class="list-disc" slot="cardContent">
		{#each phases.phaseFive as item}
			<li>{item}</li>
		{/each}
	</ul>
	<div class="flex flex-col justify-center" slot="extraContent">
		<img src={playStoreLogo} class="w-48" alt="" />
		<img src={appStoreLogo} class="w-48" alt="" />
	</div>
</PhaseCard>

<script lang="ts">
	import TeamMember from '$lib/components/LandingPage/Team/TeamMember.svelte';

	import teamMember1 from '$lib/assets/images/team/team-member-1.png';
	import teamMember2 from '$lib/assets/images/team/team-member-2.png';
	import teamMember3 from '$lib/assets/images/team/team-member-3.png';
	import teamMember4 from '$lib/assets/images/team/team-member-4.png';

	const teamList = [
		{ name: 'Gagan', position: 'Founder, CEO, Developer', avatar: teamMember1 },
		{ name: 'Ryan', position: 'CBDO, Project Manager', avatar: teamMember2 },
		{ name: 'Simmi', position: 'Director of Social Media Management', avatar: teamMember3 },
		{
			name: 'Outsourced Contractors',
			position: 'Blockchain, web, Mobile developers',
			avatar: teamMember4
		}
	];
</script>

<div class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each teamList as member}
		<TeamMember name={member.name} position={member.position} avatar={member.avatar} />
	{/each}
</div>

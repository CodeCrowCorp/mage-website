<script lang="ts">
	export let item: any
	function timeSince(date: string) {
		let created: any = new Date(date)
		let currentDate: any = new Date(Date.now())
		var seconds = Math.floor((currentDate - created) / 1000)
		var interval = seconds / 31536000
		if (interval > 1) {
			return Math.floor(interval) + ' years ago'
		}
		interval = seconds / 2592000
		if (interval > 1) {
			return Math.floor(interval) + ' months ago'
		}
		interval = seconds / 86400
		if (interval > 1) {
			return Math.floor(interval) + ' days ago'
		}
		interval = seconds / 3600
		if (interval > 1) {
			return Math.floor(interval) + ' hours ago'
		}
		interval = seconds / 60
		if (interval > 1) {
			return Math.floor(interval) + ' minutes ago'
		}
		return Math.floor(seconds) + ' seconds ago'
	}
</script>

<div class="flex flex-col md:flex-row gap-4">
	<a href={`/channel/${item._id}`} class=" md:w-96 bg-gray-200">
		<img
			loading="lazy"
			src={item.thumbnail || 'https://via.placeholder.com/300/09f/fff.png'}
			class="w-full max-h-64 border-none rounded shadow"
			alt="" />
	</a>

	<div class="md:basis-96 flex-auto flex flex-col gap-2">
		{#if Array.isArray(item.category)}
			<div class="flex flex-wrap gap-2">
				{#each item.category as cat}
					<div class="badge badge-primary">{cat}</div>
				{/each}
			</div>
		{/if}

		<a href={`/channel/${item._id}`}>
			<h2 class="text-xl font-semibold dark:text-white">
				{item.title || ''}
			</h2>
		</a>

		<p class="text-sm font-light">
			{item.memberCount || 0} Views - {timeSince(item.createdAt)}
		</p>

		<a href={`/channel/${item._id}`} class="flex items-center">
			<div class="avatar">
				<div class="w-8 rounded-full">
					<img
						loading="lazy"
						src={item.avatar || 'https://via.placeholder.com/300/09f/fff.png'}
						alt="avater" />
				</div>
			</div>
			<p class="ml-2 text-sm font-light text-center">{item.createdBy || ''}</p>
		</a>

		<p class="text-sm font-light">
			{item.description ? item.description.slice(0, 100) : ''}
		</p>

		{#if Array.isArray(item.tags)}
			<div class="flex flex-wrap gap-2">
				{#each item.tags as tag}
					<div class="badge">{tag}</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

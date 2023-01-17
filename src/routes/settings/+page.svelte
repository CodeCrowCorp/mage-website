<script>
	import { onMount } from 'svelte'
	import { themeChange } from 'theme-change'

	onMount(() => {
		themeChange(false)
	})
</script>

<div class="flex justify-center h-screen bg-base-200 py-10">
	<div class="text-center w-fit">
		<h1 class="text-5xl font-bold">Settings</h1>
		<div class="py-6">
			<div class="form-control">
				<label class="label">
					<span class="label-text">Enter your email to receive the latest news</span>
				</label>
				<label class="input-group">
					<span>Email</span>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="nerf-this@gamer.com"
						class="input input-bordered input-primary w-72" />
					<button class="btn btn-primary">Save</button>
				</label>
			</div>
		</div>

		<div class="flex flex-col border-opacity-50">
			<div class="divider">Theming</div>
			<div class="form-control w-96">
				<label class="cursor-pointer label">
					<span class="label-text">Enable dark mode</span>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						id="theme-toggle"
						data-toggle-theme="light,dark"
						data-act-class="ACTIVECLASS"
						checked />
				</label>
			</div>
			<div class="divider">1v1 chat</div>
			<div class="form-control w-96">
				<label class="cursor-pointer label">
					<span class="label-text">Do Not Disturb - prevents chat window popup</span>
					<input type="checkbox" class="toggle toggle-accent" checked />
				</label>
			</div>
			<div class="form-control w-96">
				<label class="cursor-pointer label">
					<span class="label-text">Prevent messages from randos</span>
					<input type="checkbox" class="toggle toggle-accent" checked />
				</label>
			</div>
			<div class="divider">Sound Effects</div>
			<div class="form-control w-96">
				<label class="cursor-pointer label">
					<span class="label-text">Mute all sfx</span>
					<input type="checkbox" class="toggle toggle-accent" checked />
				</label>
			</div>
			<div class="form-control w-96">
				<label class="cursor-pointer label">
					<span class="label-text">Mute channel updates sfx</span>
					<input type="checkbox" class="toggle toggle-accent" checked />
				</label>
			</div>
			<div class="form-control w-96">
				<label class="cursor-pointer label">
					<span class="label-text">Mute friend request received sfx</span>
					<input type="checkbox" class="toggle toggle-accent" checked />
				</label>
			</div>
			<div class="form-control w-96">
				<label class="cursor-pointer label">
					<span class="label-text">Mute sent and received message sfx</span>
					<input type="checkbox" class="toggle toggle-accent" checked />
				</label>
			</div>
		</div>
	</div>
</div>

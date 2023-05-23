<div class="drawer drawer-mobile drawer-end">
	<input id="admin-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<!-- Page content here -->
		<slot />
		<div class="relative h-screen w-full">
			<div class="absolute top-0 right-0">
				<label for="admin-drawer" class="btn btn-ghost normal-case text-xl drawer-button lg:hidden"
					>Admin</label>
			</div>
		</div>
	</div>
	<div class="drawer-side">
		<label for="admin-drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-80 bg-base-100 text-base-content">
			<!-- Sidebar content here -->
			<li><a href="/admin/admins">Admins</a></li>
			<li><a href="/admin/users">Users</a></li>
			<li><a href="/admin/channels">Channels</a></li>
			<li><a href="/admin/legal">Legal Policies</a></li>
			<li><a href="/admin/settings">Site Settings</a></li>
		</ul>
	</div>
</div>

<script lang="ts">
	import '$lib/assets/styles/tailwind-output.css'

	export async function load({ page, session }: { page: any; session: any }) {
		const isAdminPage = /^\/admin\/(.*)/.test(page.path)
		const isHomePage = /^\/home\/(.*)/.test(page.path)
		const isProfilePage = /^\/profile\/(.*)/.test(page.path)
		const isPremiumPage = /^\/premium\/(.*)/.test(page.path)
		const isChannelPage = /^\/channel\/(.*)/.test(page.path)
		const isMaintenanceModeEnabled = true
		if (
			!session.user &&
			(isAdminPage || isHomePage || isProfilePage || isPremiumPage || isChannelPage)
		) {
			return {
				status: 302,
				redirect: '/login'
			}
		} else {
			if (isMaintenanceModeEnabled) {
				if (!session.user.isAdmin) {
					return {
						status: 302,
						redirect: '/maintenance'
					}
				} else return { props: {} }
			} else return { props: {} }
		}
	}
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
		rel="stylesheet" />
</svelte:head>

<div class="drawer drawer-mobile">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col items-center justify-center">
		<!-- Page content here -->
		<label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
		<slot />
	</div>
	<div class="drawer-side">
		<label for="my-drawer-2" class="drawer-overlay" />
		<ul class="menu p-4 w-80 bg-base-100 text-base-content">
			<div class="navbar">
				<a class="btn btn-ghost normal-case text-xl">Mage</a>
			  </div>
			<div class="hero">
				<div class="hero-content text-center">
					<div class="max-w-md">
						<div class="avatar">
							<div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
								<img src="https://placeimg.com/192/192/people" />
							</div>
						</div>
						<p>Gagan Suie</p>
						<p class="text-pink-500">@GaganSuie</p>
					</div>
				</div>
			</div>
			<!-- Sidebar content here -->
			<li>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
					</svg>Channel List</a>
			</li>
			<li>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
					</svg>
					Community
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</a>
			</li>
			<li>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
					</svg>
					Messages
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</a>
			</li>
			<li>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
					</svg>
					Videos</a>
			</li>
			<li>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
					</svg>
					Creator Space</a>
			</li>
			<li>
				<a href="" class="text-green-400">
					<svg
						width="18"
						height="19"
						viewBox="0 0 18 19"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M11.9165 0.17244C11.8386 0.17244 11.7608 0.186613 11.687 0.215571C11.5437 0.272238 9.38149 1.1609 7.78566 3.69132C9.32941 4.24424 11.0022 5.22492 12.6693 6.892C13.9918 8.21409 14.7583 9.94153 14.8283 11.7553C14.8833 13.1886 14.4951 14.5393 13.7305 15.668C13.7846 15.793 13.8295 15.9071 13.8753 16.0212C16.1295 15.1567 17.7498 12.8535 17.7498 10.1448C17.7498 2.5156 12.3748 0.305988 12.146 0.215571C12.0723 0.186613 11.9944 0.17244 11.9165 0.17244ZM3.92172 3.88663C2.28506 3.93019 1.20341 4.38235 1.10516 4.42537C0.959322 4.48829 0.843365 4.60466 0.780448 4.75008C0.682532 4.97549 -1.55416 10.3346 3.83709 15.725C5.01001 16.8983 6.53917 17.5778 8.14292 17.6399C8.2225 17.6432 8.30138 17.6448 8.38055 17.6448C9.36055 17.6448 10.2896 17.4074 11.1092 16.962C10.9792 16.6491 10.8145 16.2859 10.5941 15.8625C8.57034 11.9817 4.19822 8.42116 4.15447 8.38533C3.97572 8.24075 3.94844 7.97814 4.09344 7.79939C4.23802 7.62106 4.50021 7.59213 4.67937 7.73754C4.86395 7.88629 9.22748 11.4408 11.333 15.4776C11.5314 15.858 11.6905 16.1981 11.8197 16.4981C12.2179 17.4223 12.3188 17.9449 12.3267 17.9874C12.3412 18.0686 12.3716 18.1461 12.4162 18.2155C12.4609 18.2849 12.5188 18.3448 12.5866 18.3917C12.6545 18.4386 12.731 18.4716 12.8117 18.4888C12.8924 18.5059 12.9756 18.507 13.0567 18.4919C13.1378 18.4767 13.2151 18.4457 13.2842 18.4005C13.3532 18.3554 13.4126 18.297 13.459 18.2287C13.5053 18.1605 13.5377 18.0838 13.5543 18.003C13.5709 17.9222 13.5713 17.8389 13.5555 17.7579C13.531 17.6262 13.367 16.8445 12.7743 15.5745C13.6192 14.5245 14.0499 13.2011 13.9958 11.7878C13.9333 10.1841 13.2534 8.65453 12.0801 7.4812C9.04798 4.44955 6.026 3.83063 3.92172 3.88663Z"
							fill="#40B58A" />
					</svg>
					Mint</a>
			</li>
			<li>
				<a href="" class="text-pink-500">
					<svg
						width="20"
						height="22"
						viewBox="0 0 20 22"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M6.77243 10.5603V8.49757H8.26432V13.0381H7.00595L5.28054 10.9754V13.0381H3.78865V8.49757H5.04703L6.77243 10.5603Z"
							fill="#EC008C" />
						<path
							d="M12.4008 8.49757V9.65216H10.2408V10.4305H12.1349V11.5851H10.2408V13.0381H8.71002V8.49757H12.4008Z"
							fill="#EC008C" />
						<path
							d="M15.6923 13.0381H14.1615V9.68459H12.8318V8.49757H17.022V9.68459H15.6923V13.0381Z"
							fill="#EC008C" />
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M10.7144 0.345114C10.4249 0.188022 10.0756 0.188022 9.78616 0.345114L1.00887 5.10863C0.695285 5.27881 0.5 5.60699 0.5 5.96378V15.4908C0.5 15.8476 0.695285 16.1758 1.00887 16.346L9.78616 21.1095C10.0756 21.2666 10.4249 21.2666 10.7144 21.1095L19.4916 16.346C19.8052 16.1758 20.0005 15.8476 20.0005 15.4908V5.96378C20.0005 5.60699 19.8052 5.27881 19.4916 5.10863L10.7144 0.345114ZM2.44595 14.9118V6.54277L10.2503 2.30729L18.0546 6.54276V14.9118L10.2503 19.1473L2.44595 14.9118Z"
							fill="#EC008C" />
					</svg>
					Premium</a>
			</li>
			<li>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
					</svg>
					Careers</a>
			</li>
			<li>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 00-1.652 1.306A9.025 9.025 0 004.33 7.288" />
					</svg>
					Help & Legal
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</a>
			</li>
			<li>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
					</svg>
					Settings</a>
			</li>
			<li>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
					</svg>
					Log Out</a>
			</li>
		</ul>
		<footer class="footer footer-center p-10 text-base-content rounded">
			<div class="grid grid-flow-col gap-4">
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="fill-current">
						<path
							d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
				</a>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="fill-current">
						<path
							d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
				</a>
				<a href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="fill-current">
						<path
							d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
				</a>
			</div>
			<p>Code Crow Corp © 2023</p>
		</footer>
	</div>
</div>

<!-- <style global>
	:root {
		--color-default: #ffffff;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--my-color: #25252a;
		}
	}
	[data-theme='dark'] {
		--color-default: #25252a;
	}
	[data-theme='light'] {
		--my-color: #ffffff;
	}
	body {
		background-color: var(--color-default);
	}
</style> -->

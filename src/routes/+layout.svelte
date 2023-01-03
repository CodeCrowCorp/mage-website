<script lang="ts">
	import '$lib/assets/styles/tailwind-output.css'
	// @ts-ignore
	import NProgress from 'nprogress'
	import { navigating } from '$app/stores'

	// NProgress Loading bar
	import 'nprogress/nprogress.css'
	NProgress.configure({
		minimum: 0.75,
		showSpinner: false,
		speed: 5,
		trickleSpeed: 200
	})
	$: {
		if ($navigating) {
			NProgress.start()
		}
		if (!$navigating) {
			NProgress.done()
		}
	}

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
	<div class="drawer-content bg-base-200">
		<!-- Page content here -->
		<label for="my-drawer-2" class="btn btn-ghost normal-case text-xl drawer-button lg:hidden"
			>Mage</label>
		<slot />
	</div>
	<div class="drawer-side">
		<label for="my-drawer-2" class="drawer-overlay" />
		<div class="menu p-4 w-80 bg-base-100 text-base-content">
			<ul>
				<div class="navbar">
					<a href="/home" class="btn btn-ghost normal-case text-xl">Mage</a>
				</div>
				<li>
					<a href="/profile/me" class="hero rounded-md cursor-pointer">
						<div class="hero-content">
							<div class="max-w-md">
								<div class="avatar online">
									<div
										class="w-24 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2">
										<img src="https://placeimg.com/192/192/people" />
									</div>
								</div>
							</div>
							<div class="grid grid-cols-3 gap-1">
								<p class="col-span-3">Gagan Suie</p>
								<p class="col-span-3 text-pink-500">@GaganSuie</p>
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
										d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
								</svg>
								<p class="col-span-2 tooltip text-start" data-tip="2046 followers">2046</p>
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
										d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
								</svg>
								<p class="col-span-2 tooltip text-start" data-tip="300 hours viewed">300 h</p>
							</div>
						</div>
					</a>
				</li>
				<!-- Sidebar content here -->
				<li>
					<a href="/home">
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
				<!-- <li>
				<a href="/videos">
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
				<a href="/creator-space">
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
			</li> -->
				<li>
					<a href="https://mint.codecrow.io" class="text-green-400">
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
						Mint <span class="badge">New</span>
					</a>
				</li>
				<li>
					<a href="/premium" class="text-pink-500">
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
						Premium <span class="badge">New</span>
					</a>
				</li>
				<li>
					<a href="/careers">
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
					<div class="dropdown dropdown-bottom dropdown-end" tabindex="0">
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
						<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
							<li><a href="/contact">Contact</a></li>
							<li><a href="/legal">Legal</a></li>
						</ul>
					</div>
				</li>
				<li>
					<a href="/settings">
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
			<footer class="footer p-4 text-base-content absolute inset-x-0 bottom-0">
				<div>
					<div class="grid grid-flow-col gap-4">
						<a href="https://github.com/CodeCrowCorp" target="_blank" rel="noreferrer">
							<svg
								width="26"
								height="26"
								viewBox="0 0 26 26"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<rect x="3.41797" y="5.53546" width="18.3333" height="15.7955" fill="white" />
								<rect x="5" y="20.02" width="6" height="3.06246" fill="white" />
								<rect x="9.5" y="12.1137" width="7" height="13.7811" fill="white" />
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M13 0.894775C6.09375 0.894775 0.5 6.62598 0.5 13.7019C0.5 19.3691 4.07812 24.1558 9.04688 25.8527C9.67188 25.9648 9.90625 25.5806 9.90625 25.2444C9.90625 24.9402 9.89062 23.9316 9.89062 22.859C6.75 23.4514 5.9375 22.0746 5.6875 21.3542C5.54688 20.986 4.9375 19.8494 4.40625 19.5452C3.96875 19.3051 3.34375 18.7127 4.39062 18.6967C5.375 18.6807 6.07812 19.6252 6.3125 20.0094C7.4375 21.9465 9.23437 21.4022 9.95312 21.066C10.0625 20.2336 10.3906 19.6733 10.75 19.3531C7.96875 19.0329 5.0625 17.9283 5.0625 13.0296C5.0625 11.6368 5.54688 10.4841 6.34375 9.58763C6.21875 9.26745 5.78125 7.95472 6.46875 6.19373C6.46875 6.19373 7.51562 5.85755 9.90625 7.50647C10.9062 7.21831 11.9687 7.07423 13.0312 7.07423C14.0937 7.07423 15.1562 7.21831 16.1562 7.50647C18.5469 5.84154 19.5938 6.19373 19.5938 6.19373C20.2812 7.95472 19.8438 9.26745 19.7188 9.58763C20.5156 10.4841 21 11.6208 21 13.0296C21 17.9443 18.0781 19.0329 15.2969 19.3531C15.75 19.7533 16.1406 20.5217 16.1406 21.7224C16.1406 23.4354 16.125 24.8121 16.125 25.2444C16.125 25.5806 16.3594 25.9808 16.9844 25.8527C19.4658 24.9943 21.6221 23.3603 23.1496 21.1806C24.6772 19.0009 25.4993 16.3853 25.5 13.7019C25.5 6.62598 19.9062 0.894775 13 0.894775Z"
									fill="black" />
							</svg></a>
						<a href="https://discord.gg/CodeCrow" target="_blank" rel="noreferrer">
							<svg
								width="28"
								height="22"
								viewBox="0 0 28 22"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<g clip-path="url(#clip0_9856_12083)">
									<path
										d="M23.449 2.76486C21.7211 1.97205 19.8683 1.38795 17.931 1.05341C17.8958 1.04695 17.8605 1.06308 17.8423 1.09536C17.604 1.51918 17.3401 2.07209 17.1553 2.50667C15.0716 2.19473 12.9986 2.19473 10.9577 2.50667C10.7728 2.06243 10.4993 1.51918 10.2599 1.09536C10.2417 1.06416 10.2065 1.04803 10.1712 1.05341C8.23503 1.38688 6.38218 1.97098 4.65327 2.76486C4.6383 2.77131 4.62547 2.78208 4.61695 2.79605C1.10249 8.04659 0.139731 13.1681 0.612028 18.2261C0.614165 18.2508 0.628056 18.2745 0.647291 18.2895C2.96603 19.9923 5.21213 21.0261 7.41652 21.7113C7.4518 21.7221 7.48918 21.7092 7.51163 21.6801C8.03308 20.968 8.49791 20.2172 8.89645 19.4276C8.91997 19.3814 8.89752 19.3265 8.84945 19.3082C8.11216 19.0285 7.41011 18.6875 6.73479 18.3003C6.68137 18.2691 6.67709 18.1927 6.72623 18.1561C6.86835 18.0496 7.0105 17.9388 7.14619 17.8269C7.17075 17.8065 7.20496 17.8022 7.23382 17.8151C11.6704 19.8407 16.4735 19.8407 20.8577 17.8151C20.8866 17.8011 20.9208 17.8054 20.9464 17.8259C21.0822 17.9377 21.2243 18.0496 21.3675 18.1561C21.4166 18.1927 21.4134 18.2691 21.36 18.3003C20.6847 18.695 19.9826 19.0285 19.2443 19.3071C19.1962 19.3254 19.1748 19.3814 19.1983 19.4276C19.6054 20.2161 20.0702 20.9669 20.5821 21.6791C20.6035 21.7092 20.6419 21.7221 20.6772 21.7113C22.8923 21.0261 25.1383 19.9923 27.4571 18.2895C27.4774 18.2745 27.4902 18.2519 27.4924 18.2271C28.0576 12.3795 26.5456 7.30006 23.4842 2.79712C23.4768 2.78208 23.464 2.77131 23.449 2.76486ZM9.55898 15.1463C8.22327 15.1463 7.12267 13.92 7.12267 12.414C7.12267 10.908 8.20192 9.68169 9.55898 9.68169C10.9267 9.68169 12.0166 10.9187 11.9952 12.414C11.9952 13.92 10.916 15.1463 9.55898 15.1463ZM18.5668 15.1463C17.2311 15.1463 16.1305 13.92 16.1305 12.414C16.1305 10.908 17.2097 9.68169 18.5668 9.68169C19.9345 9.68169 21.0244 10.9187 21.0031 12.414C21.0031 13.92 19.9345 15.1463 18.5668 15.1463Z"
										fill="#5865F2" />
								</g>
								<defs>
									<clipPath id="clip0_9856_12083">
										<rect
											width="27.1091"
											height="21"
											fill="white"
											transform="translate(0.5 0.894775)" />
									</clipPath>
								</defs>
							</svg>
						</a>
						<a href="https://twitter.com/CodeCrowCorp" target="_blank" rel="noreferrer">
							<svg
								width="28"
								height="23"
								viewBox="0 0 28 23"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M8.99099 22.2163C19.0487 22.2163 24.5489 13.8904 24.5489 6.67054C24.5489 6.43406 24.544 6.19864 24.5334 5.9643C25.6011 5.19307 26.5291 4.23063 27.261 3.13503C26.2812 3.57018 25.2269 3.86311 24.1209 3.9952C25.2498 3.31878 26.1165 2.24876 26.5254 0.973176C25.4689 1.599 24.2989 2.05386 23.0532 2.29943C22.0554 1.23743 20.6348 0.573181 19.0619 0.573181C16.0422 0.573181 13.5935 3.02006 13.5935 6.03619C13.5935 6.46494 13.6415 6.88198 13.7353 7.28201C9.19076 7.05352 5.16097 4.87937 2.46401 1.57343C1.99441 2.38087 1.72363 3.31881 1.72363 4.3196C1.72363 6.21519 2.68898 7.88862 4.15695 8.8676C3.25984 8.83991 2.4171 8.59383 1.68053 8.18425C1.67972 8.20717 1.67972 8.22953 1.67972 8.25403C1.67972 10.9001 3.56454 13.1094 6.06653 13.61C5.60706 13.7351 5.12363 13.8022 4.62468 13.8022C4.27289 13.8022 3.93014 13.7677 3.597 13.7037C4.29313 15.8746 6.31176 17.4544 8.705 17.4986C6.83351 18.9643 4.47596 19.8373 1.91368 19.8373C1.47286 19.8373 1.03738 19.8123 0.609375 19.7617C3.02936 21.3116 5.90287 22.216 8.99128 22.216"
									fill="#1DA1F2" />
							</svg>
						</a>
						<a href="https://magiceden.io" target="_blank" rel="noreferrer">
							<svg
								width="34"
								height="22"
								viewBox="0 0 34 22"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink">
								<rect x="0.260742" y="0.894775" width="33.1579" height="21" fill="url(#pattern0)" />
								<defs>
									<pattern
										id="pattern0"
										patternContentUnits="objectBoundingBox"
										width="1"
										height="1">
										<use xlink:href="#image0_9856_12098" transform="scale(0.00183575 0.00289855)" />
									</pattern>
									<image
										id="image0_9856_12098"
										width="545"
										height="345"
										xlink:href="data:image/png;base64,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" />
								</defs>
							</svg>
						</a>
						<a href="https://www.dexlab.space" target="_blank" rel="noreferrer">
							<svg
								width="26"
								height="26"
								viewBox="0 0 26 26"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<g clip-path="url(#clip0_9856_12099)">
									<path
										d="M0.418945 13.3948C0.418945 6.49075 6.01492 0.894775 12.9189 0.894775C19.823 0.894775 25.4189 6.49075 25.4189 13.3948C25.4189 20.2988 19.823 25.8948 12.9189 25.8948C6.01492 25.8948 0.418945 20.2988 0.418945 13.3948ZM1.58179 13.3948C1.58179 19.6462 6.66755 24.7319 12.9189 24.7319C19.1703 24.7319 24.2561 19.6462 24.2561 13.3948C24.2561 7.14338 19.1703 2.05762 12.9189 2.05762C6.66755 2.05762 1.58179 7.14338 1.58179 13.3948ZM7.2368 20.8416C6.40775 20.8261 5.8364 20.2712 5.61886 19.8286C5.40132 19.386 5.3967 18.811 5.60487 18.3737C5.81304 17.9363 9.81584 9.85784 9.94818 9.58C10.0805 9.30216 10.0663 9.31741 10.0682 9.00781C10.0702 8.69822 10.0682 5.41898 10.0682 5.41898C10.0682 5.41898 9.74967 5.41898 9.55829 5.41898C9.09564 5.41996 8.89027 5.08322 8.88789 4.81265C8.88551 4.54796 9.06892 4.1915 9.53478 4.19038C9.93042 4.1894 10.626 4.19038 11.2975 4.19038L11.2923 6.07175H12.7067V6.6873H11.2926V7.31755H12.707V7.93003H11.2926V9.50991C11.2926 9.6694 11.2705 9.67359 11.1917 9.84049C11.113 10.0074 6.88971 18.5544 6.75694 18.8377C6.62418 19.121 6.89194 19.6011 7.28968 19.6085C7.68741 19.616 18.0467 19.6063 18.5516 19.6063C19.0565 19.6063 19.1951 19.0047 19.0961 18.81C18.997 18.6153 14.6817 9.90527 14.6067 9.74019C14.5317 9.57511 14.5409 9.58826 14.5447 9.31629C14.5485 9.04433 14.5447 4.19024 14.5447 4.19024C14.5447 4.19024 15.7311 4.19024 16.3494 4.19024C16.7132 4.19024 16.9583 4.47871 16.9583 4.79489C16.9583 5.09441 16.7242 5.39645 16.3494 5.39645C16.1843 5.40009 15.7704 5.39645 15.7704 5.39645C15.7704 5.39645 15.7704 8.98123 15.7704 9.18325C15.7704 9.38526 15.828 9.42891 15.9592 9.69724C16.0905 9.96556 19.8998 17.6397 20.1587 18.1593C20.4177 18.6789 20.5085 19.4257 20.0451 20.0466C19.5818 20.6674 19.0346 20.816 18.599 20.8195C18.2445 20.8226 11.4897 20.8454 8.54122 20.8454C7.8669 20.8454 7.39222 20.8441 7.23792 20.8413L7.2368 20.8416ZM12.4697 17.7817C12.4697 17.6981 12.4945 17.6164 12.541 17.5469C12.5874 17.4773 12.6535 17.4231 12.7307 17.3911C12.808 17.3591 12.893 17.3508 12.975 17.3671C13.057 17.3834 13.1323 17.4237 13.1915 17.4828C13.2506 17.5419 13.2908 17.6172 13.3072 17.6993C13.3235 17.7813 13.3151 17.8663 13.2831 17.9435C13.2511 18.0208 13.1969 18.0868 13.1274 18.1333C13.0579 18.1797 12.9761 18.2045 12.8925 18.2045C12.837 18.2045 12.782 18.1936 12.7307 18.1723C12.6794 18.1511 12.6328 18.1199 12.5935 18.0806C12.5542 18.0414 12.5231 17.9947 12.5019 17.9434C12.4806 17.8921 12.4697 17.8371 12.4697 17.7816V17.7817ZM13.7274 17.693C13.7068 17.6725 13.6939 17.6454 13.691 17.6164C13.688 17.5874 13.6953 17.5582 13.7114 17.534C13.7276 17.5097 13.7517 17.4918 13.7796 17.4833C13.8075 17.4748 13.8374 17.4763 13.8644 17.4874C13.8913 17.4986 13.9136 17.5187 13.9273 17.5445C13.941 17.5702 13.9454 17.5999 13.9397 17.6285C13.934 17.657 13.9185 17.6828 13.896 17.7012C13.8734 17.7197 13.8451 17.7298 13.816 17.7297C13.7828 17.7296 13.751 17.7165 13.7274 17.693ZM11.8866 17.693C11.866 17.6725 11.8531 17.6454 11.8502 17.6164C11.8472 17.5874 11.8545 17.5582 11.8706 17.534C11.8868 17.5097 11.9109 17.4918 11.9388 17.4833C11.9667 17.4748 11.9966 17.4763 12.0236 17.4874C12.0505 17.4986 12.0728 17.5187 12.0865 17.5445C12.1002 17.5702 12.1046 17.5999 12.0989 17.6285C12.0932 17.657 12.0777 17.6828 12.0552 17.7012C12.0326 17.7197 12.0043 17.7298 11.9752 17.7297C11.942 17.7296 11.9102 17.7165 11.8866 17.693ZM14.2821 17.3609C14.1222 17.201 14.1264 16.9374 14.2915 16.7724C14.4566 16.6073 14.7201 16.6031 14.8802 16.763C15.0402 16.9229 15.0359 17.1865 14.8708 17.3517C14.8311 17.3915 14.7839 17.4232 14.7319 17.4448C14.6799 17.4664 14.6242 17.4775 14.5679 17.4776C14.5149 17.4779 14.4623 17.4676 14.4133 17.4475C14.3642 17.4274 14.3197 17.3977 14.2821 17.3602V17.3609ZM10.9406 17.3517C10.7755 17.1866 10.7714 16.923 10.9313 16.763C11.0912 16.6029 11.3549 16.6071 11.52 16.7724C11.685 16.9376 11.6892 17.201 11.5293 17.3609C11.4918 17.3984 11.4472 17.4281 11.3982 17.4482C11.3491 17.4683 11.2965 17.4786 11.2435 17.4783C11.1872 17.4782 11.1315 17.4671 11.0795 17.4455C11.0276 17.4239 10.9804 17.3922 10.9406 17.3524V17.3517ZM12.776 17.1038C12.776 17.0789 12.7834 17.0545 12.7972 17.0338C12.811 17.0131 12.8307 16.997 12.8537 16.9875C12.8767 16.9779 12.902 16.9754 12.9264 16.9803C12.9509 16.9852 12.9733 16.9971 12.9909 17.0148C13.0085 17.0324 13.0205 17.0548 13.0254 17.0792C13.0302 17.1036 13.0277 17.129 13.0182 17.152C13.0087 17.175 12.9925 17.1946 12.9718 17.2085C12.9511 17.2223 12.9268 17.2297 12.9019 17.2297C12.8685 17.2297 12.8365 17.2164 12.8128 17.1928C12.7892 17.1692 12.776 17.1372 12.776 17.1038ZM12.776 16.7504C12.776 16.7255 12.7834 16.7012 12.7972 16.6804C12.811 16.6597 12.8307 16.6436 12.8537 16.6341C12.8767 16.6245 12.902 16.6221 12.9264 16.6269C12.9509 16.6318 12.9733 16.6438 12.9909 16.6614C13.0085 16.679 13.0205 16.7014 13.0254 16.7258C13.0302 16.7503 13.0277 16.7756 13.0182 16.7986C13.0087 16.8216 12.9925 16.8413 12.9718 16.8551C12.9511 16.8689 12.9268 16.8763 12.9019 16.8763C12.8685 16.8763 12.8365 16.863 12.8128 16.8394C12.7892 16.8158 12.776 16.7838 12.776 16.7504ZM14.0243 16.6824C14.0036 16.6618 13.9907 16.6348 13.9878 16.6058C13.9849 16.5768 13.9921 16.5476 14.0083 16.5234C14.0244 16.4991 14.0485 16.4812 14.0764 16.4727C14.1043 16.4642 14.1342 16.4657 14.1612 16.4768C14.1881 16.4879 14.2104 16.5081 14.2241 16.5338C14.2379 16.5595 14.2423 16.5891 14.2366 16.6177C14.2309 16.6463 14.2155 16.672 14.1929 16.6905C14.1704 16.709 14.1421 16.7191 14.113 16.7191C14.0797 16.719 14.0479 16.7059 14.0243 16.6824ZM11.6099 16.6824C11.5892 16.6618 11.5764 16.6348 11.5734 16.6058C11.5705 16.5768 11.5778 16.5476 11.5939 16.5234C11.6101 16.4991 11.6341 16.4812 11.662 16.4727C11.6899 16.4642 11.7199 16.4657 11.7468 16.4768C11.7737 16.4879 11.796 16.5081 11.8097 16.5338C11.8235 16.5595 11.8279 16.5891 11.8222 16.6177C11.8165 16.6463 11.8011 16.672 11.7785 16.6905C11.756 16.709 11.7278 16.7191 11.6986 16.7191C11.6654 16.719 11.6335 16.7059 11.6099 16.6824ZM12.776 16.3956C12.776 16.3707 12.7834 16.3464 12.7972 16.3257C12.811 16.305 12.8307 16.2888 12.8537 16.2793C12.8767 16.2698 12.902 16.2673 12.9264 16.2721C12.9509 16.277 12.9733 16.289 12.9909 16.3066C13.0085 16.3242 13.0205 16.3466 13.0254 16.3711C13.0302 16.3955 13.0277 16.4208 13.0182 16.4438C13.0087 16.4668 12.9925 16.4865 12.9718 16.5003C12.9511 16.5141 12.9268 16.5215 12.9019 16.5215C12.8685 16.5215 12.8365 16.5083 12.8128 16.4846C12.7892 16.461 12.776 16.429 12.776 16.3956ZM13.7744 16.4324C13.7538 16.4118 13.7409 16.3848 13.738 16.3558C13.735 16.3268 13.7423 16.2976 13.7584 16.2734C13.7746 16.2491 13.7987 16.2312 13.8265 16.2227C13.8544 16.2142 13.8844 16.2157 13.9113 16.2268C13.9383 16.2379 13.9605 16.2581 13.9743 16.2838C13.988 16.3095 13.9924 16.3391 13.9867 16.3677C13.981 16.3963 13.9656 16.422 13.9431 16.4405C13.9205 16.459 13.8923 16.4691 13.8631 16.4691C13.8299 16.469 13.798 16.4559 13.7744 16.4324ZM11.8598 16.4324C11.8391 16.4118 11.8262 16.3848 11.8233 16.3558C11.8204 16.3268 11.8276 16.2976 11.8438 16.2734C11.8599 16.2491 11.884 16.2312 11.9119 16.2227C11.9398 16.2142 11.9697 16.2157 11.9967 16.2268C12.0236 16.2379 12.0458 16.2581 12.0596 16.2838C12.0733 16.3095 12.0778 16.3391 12.0721 16.3677C12.0664 16.3963 12.0509 16.422 12.0284 16.4405C12.0059 16.459 11.9776 16.4691 11.9485 16.4691C11.9152 16.469 11.8833 16.4559 11.8598 16.4324ZM15.0314 16.3846C15.0108 16.364 14.9979 16.3369 14.995 16.3079C14.992 16.2789 14.9993 16.2498 15.0154 16.2255C15.0316 16.2013 15.0556 16.1834 15.0835 16.1749C15.1114 16.1664 15.1414 16.1678 15.1683 16.1789C15.1953 16.1901 15.2175 16.2102 15.2312 16.2359C15.245 16.2616 15.2494 16.2913 15.2437 16.3199C15.238 16.3485 15.2226 16.3742 15.2001 16.3927C15.1775 16.4112 15.1493 16.4212 15.1201 16.4212C15.0869 16.4212 15.055 16.408 15.0314 16.3846ZM10.5595 16.3846C10.5389 16.364 10.526 16.3369 10.5231 16.3079C10.5202 16.2789 10.5274 16.2498 10.5436 16.2255C10.5597 16.2012 10.5838 16.1833 10.6117 16.1748C10.6396 16.1664 10.6696 16.1678 10.6965 16.179C10.7234 16.1901 10.7457 16.2103 10.7594 16.236C10.7731 16.2617 10.7775 16.2914 10.7718 16.32C10.7661 16.3486 10.7507 16.3743 10.7281 16.3928C10.7055 16.4112 10.6773 16.4213 10.6481 16.4212C10.6149 16.4211 10.5831 16.408 10.5595 16.3846ZM13.5236 16.1817C13.5029 16.1611 13.49 16.1341 13.4871 16.1051C13.4842 16.0761 13.4914 16.0469 13.5076 16.0227C13.5237 15.9984 13.5478 15.9805 13.5757 15.972C13.6036 15.9635 13.6335 15.965 13.6605 15.9761C13.6874 15.9872 13.7097 16.0074 13.7234 16.0331C13.7372 16.0588 13.7416 16.0884 13.7359 16.117C13.7302 16.1456 13.7148 16.1713 13.6922 16.1898C13.6697 16.2083 13.6414 16.2184 13.6123 16.2184C13.579 16.2183 13.5472 16.2052 13.5236 16.1817ZM12.1106 16.1817C12.0899 16.1611 12.0771 16.1341 12.0741 16.1051C12.0712 16.0761 12.0785 16.0469 12.0946 16.0227C12.1108 15.9984 12.1348 15.9805 12.1627 15.972C12.1906 15.9635 12.2206 15.965 12.2475 15.9761C12.2744 15.9872 12.2967 16.0074 12.3104 16.0331C12.3242 16.0588 12.3286 16.0884 12.3229 16.117C12.3172 16.1456 12.3018 16.1713 12.2792 16.1898C12.2567 16.2083 12.2285 16.2184 12.1993 16.2184C12.1661 16.2183 12.1342 16.2052 12.1106 16.1817ZM12.1526 15.3906C12.1526 15.2416 12.1968 15.096 12.2795 14.9721C12.3623 14.8482 12.4799 14.7517 12.6176 14.6947C12.7552 14.6377 12.9067 14.6228 13.0528 14.6518C13.1989 14.6809 13.3331 14.7527 13.4384 14.858C13.5438 14.9634 13.6155 15.0976 13.6446 15.2437C13.6736 15.3898 13.6587 15.5413 13.6016 15.6789C13.5446 15.8165 13.448 15.9342 13.3242 16.0169C13.2003 16.0997 13.0546 16.1438 12.9057 16.1438C12.7059 16.1438 12.5143 16.0644 12.3731 15.9231C12.2318 15.7819 12.1525 15.5903 12.1524 15.3906H12.1526ZM14.8746 15.3774C14.8746 15.2938 14.8993 15.212 14.9458 15.1424C14.9923 15.0729 15.0583 15.0186 15.1356 14.9866C15.2128 14.9546 15.2979 14.9462 15.3799 14.9625C15.462 14.9788 15.5374 15.0191 15.5965 15.0782C15.6557 15.1373 15.696 15.2127 15.7123 15.2947C15.7286 15.3768 15.7203 15.4618 15.6882 15.5391C15.6562 15.6164 15.602 15.6824 15.5325 15.7289C15.4629 15.7754 15.3812 15.8002 15.2975 15.8002C15.1854 15.8002 15.0778 15.7557 14.9985 15.6764C14.9192 15.5971 14.8746 15.4896 14.8746 15.3774ZM10.0913 15.3774C10.0913 15.2938 10.1161 15.212 10.1625 15.1424C10.209 15.0729 10.275 15.0186 10.3523 14.9866C10.4296 14.9546 10.5146 14.9462 10.5966 14.9625C10.6787 14.9788 10.7541 15.0191 10.8132 15.0782C10.8724 15.1373 10.9127 15.2127 10.929 15.2947C10.9453 15.3768 10.937 15.4618 10.905 15.5391C10.8729 15.6164 10.8187 15.6824 10.7492 15.7289C10.6796 15.7754 10.5979 15.8002 10.5142 15.8002C10.4021 15.8002 10.2945 15.7557 10.2152 15.6764C10.1359 15.5971 10.0913 15.4896 10.0913 15.3774ZM14.4876 15.3864C14.4876 15.3615 14.495 15.3371 14.5089 15.3164C14.5227 15.2957 14.5424 15.2796 14.5654 15.2701C14.5884 15.2605 14.6137 15.258 14.6381 15.2629C14.6625 15.2677 14.685 15.2797 14.7026 15.2974C14.7202 15.315 14.7322 15.3374 14.737 15.3618C14.7419 15.3862 14.7394 15.4116 14.7299 15.4346C14.7203 15.4576 14.7042 15.4772 14.6835 15.4911C14.6628 15.5049 14.6384 15.5123 14.6135 15.5123C14.5802 15.5123 14.5481 15.499 14.5245 15.4754C14.5009 15.4518 14.4876 15.4198 14.4876 15.3864ZM14.1343 15.3864C14.1343 15.3615 14.1416 15.3371 14.1555 15.3164C14.1693 15.2957 14.189 15.2796 14.212 15.2701C14.235 15.2605 14.2603 15.258 14.2847 15.2629C14.3091 15.2677 14.3316 15.2797 14.3492 15.2974C14.3668 15.315 14.3788 15.3374 14.3836 15.3618C14.3885 15.3862 14.386 15.4116 14.3765 15.4346C14.367 15.4576 14.3508 15.4772 14.3301 15.4911C14.3094 15.5049 14.2851 15.5123 14.2602 15.5123C14.2268 15.5123 14.1947 15.499 14.1711 15.4754C14.1475 15.4518 14.1343 15.4198 14.1343 15.3864ZM13.7796 15.3864C13.7796 15.3615 13.787 15.3371 13.8008 15.3164C13.8147 15.2957 13.8343 15.2796 13.8573 15.2701C13.8803 15.2605 13.9057 15.258 13.9301 15.2629C13.9545 15.2677 13.9769 15.2797 13.9945 15.2974C14.0122 15.315 14.0241 15.3374 14.029 15.3618C14.0339 15.3862 14.0314 15.4116 14.0218 15.4346C14.0123 15.4576 13.9962 15.4772 13.9755 15.4911C13.9548 15.5049 13.9304 15.5123 13.9055 15.5123C13.8721 15.5123 13.8401 15.499 13.8165 15.4754C13.7929 15.4518 13.7796 15.4198 13.7796 15.3864ZM11.7811 15.3864C11.7811 15.3615 11.7885 15.3371 11.8024 15.3164C11.8162 15.2957 11.8359 15.2796 11.8589 15.2701C11.8819 15.2605 11.9072 15.258 11.9316 15.2629C11.956 15.2677 11.9785 15.2797 11.9961 15.2974C12.0137 15.315 12.0257 15.3374 12.0305 15.3618C12.0354 15.3862 12.0329 15.4116 12.0234 15.4346C12.0138 15.4576 11.9977 15.4772 11.977 15.4911C11.9563 15.5049 11.932 15.5123 11.9071 15.5123C11.8737 15.5123 11.8416 15.499 11.818 15.4754C11.7944 15.4518 11.7811 15.4198 11.7811 15.3864ZM11.4266 15.3864C11.4266 15.3615 11.434 15.3371 11.4479 15.3164C11.4617 15.2957 11.4814 15.2796 11.5044 15.2701C11.5274 15.2605 11.5527 15.258 11.5771 15.2629C11.6015 15.2677 11.624 15.2797 11.6416 15.2974C11.6592 15.315 11.6712 15.3374 11.676 15.3618C11.6809 15.3862 11.6784 15.4116 11.6689 15.4346C11.6593 15.4576 11.6432 15.4772 11.6225 15.4911C11.6018 15.5049 11.5775 15.5123 11.5525 15.5123C11.5192 15.5123 11.4871 15.499 11.4635 15.4754C11.4399 15.4518 11.4266 15.4198 11.4266 15.3864ZM11.0733 15.3864C11.0733 15.3615 11.0806 15.3371 11.0945 15.3164C11.1083 15.2957 11.128 15.2796 11.151 15.2701C11.174 15.2605 11.1993 15.258 11.2237 15.2629C11.2482 15.2677 11.2706 15.2797 11.2882 15.2974C11.3058 15.315 11.3178 15.3374 11.3227 15.3618C11.3275 15.3862 11.325 15.4116 11.3155 15.4346C11.306 15.4576 11.2898 15.4772 11.2691 15.4911C11.2484 15.5049 11.2241 15.5123 11.1992 15.5123C11.1658 15.5123 11.1337 15.499 11.1101 15.4754C11.0865 15.4518 11.0733 15.4198 11.0733 15.3864ZM13.5237 14.7684C13.5031 14.7479 13.4903 14.7207 13.4874 14.6917C13.4845 14.6627 13.4918 14.6336 13.508 14.6094C13.5242 14.5852 13.5483 14.5673 13.5761 14.5588C13.604 14.5504 13.634 14.5519 13.6609 14.563C13.6878 14.5742 13.7101 14.5944 13.7238 14.6201C13.7375 14.6458 13.7419 14.6755 13.7361 14.704C13.7304 14.7326 13.715 14.7583 13.6924 14.7768C13.6698 14.7952 13.6416 14.8053 13.6124 14.8052C13.5792 14.8052 13.5473 14.7919 13.5237 14.7684ZM12.1107 14.7684C12.0901 14.7479 12.0773 14.7207 12.0744 14.6917C12.0715 14.6627 12.0788 14.6336 12.095 14.6094C12.1112 14.5851 12.1353 14.5673 12.1632 14.5588C12.1911 14.5504 12.2211 14.5519 12.248 14.5631C12.2749 14.5742 12.2971 14.5944 12.3108 14.6202C12.3245 14.6459 12.3289 14.6756 12.3231 14.7042C12.3174 14.7327 12.3019 14.7584 12.2793 14.7769C12.2567 14.7953 12.2285 14.8053 12.1993 14.8052C12.1661 14.8051 12.1343 14.7919 12.1107 14.7684ZM15.0314 14.5489C15.011 14.5285 14.9983 14.5015 14.9955 14.4727C14.9927 14.4439 15 14.4151 15.0161 14.391C15.0322 14.367 15.0562 14.3493 15.0839 14.3409C15.1116 14.3326 15.1413 14.3341 15.168 14.3452C15.1947 14.3563 15.2168 14.3763 15.2304 14.4018C15.244 14.4273 15.2483 14.4568 15.2427 14.4852C15.237 14.5135 15.2217 14.5391 15.1993 14.5574C15.1769 14.5757 15.1489 14.5857 15.12 14.5857C15.0868 14.5856 15.0549 14.5724 15.0314 14.5489ZM10.5858 14.5489C10.5652 14.5284 10.5524 14.5012 10.5495 14.4722C10.5466 14.4432 10.5539 14.4141 10.5701 14.3899C10.5863 14.3657 10.6104 14.3478 10.6383 14.3393C10.6662 14.3309 10.6961 14.3324 10.723 14.3435C10.75 14.3547 10.7722 14.3749 10.7859 14.4006C10.7996 14.4263 10.804 14.456 10.7983 14.4845C10.7925 14.5131 10.7771 14.5388 10.7545 14.5573C10.7319 14.5757 10.7037 14.5858 10.6745 14.5857C10.6413 14.5857 10.6094 14.5724 10.5858 14.5489ZM13.7743 14.518C13.7536 14.4975 13.7407 14.4704 13.7378 14.4414C13.7349 14.4124 13.7421 14.3833 13.7583 14.359C13.7744 14.3347 13.7985 14.3168 13.8264 14.3083C13.8543 14.2998 13.8842 14.3013 13.9112 14.3124C13.9381 14.3235 13.9604 14.3437 13.9741 14.3694C13.9879 14.3951 13.9923 14.4248 13.9866 14.4533C13.9809 14.4819 13.9655 14.5077 13.9429 14.5261C13.9204 14.5446 13.8921 14.5547 13.863 14.5547C13.8297 14.5547 13.7979 14.5415 13.7743 14.518ZM11.8596 14.518C11.839 14.4975 11.8261 14.4704 11.8232 14.4414C11.8202 14.4124 11.8275 14.3833 11.8436 14.359C11.8598 14.3347 11.8839 14.3168 11.9117 14.3083C11.9396 14.2998 11.9696 14.3013 11.9965 14.3124C12.0235 14.3235 12.0457 14.3437 12.0595 14.3694C12.0732 14.3951 12.0776 14.4248 12.0719 14.4533C12.0662 14.4819 12.0508 14.5077 12.0283 14.5261C12.0057 14.5446 11.9775 14.5547 11.9483 14.5547C11.9151 14.5547 11.8832 14.5415 11.8596 14.518ZM12.7802 14.3781C12.7802 14.3532 12.7875 14.3289 12.8014 14.3082C12.8152 14.2875 12.8349 14.2713 12.8579 14.2618C12.8809 14.2523 12.9062 14.2498 12.9306 14.2546C12.9551 14.2595 12.9775 14.2715 12.9951 14.2891C13.0127 14.3067 13.0247 14.3291 13.0296 14.3536C13.0344 14.378 13.0319 14.4033 13.0224 14.4263C13.0129 14.4493 12.9967 14.469 12.976 14.4828C12.9553 14.4967 12.931 14.504 12.9061 14.504C12.8727 14.504 12.8407 14.4908 12.817 14.4672C12.7934 14.4435 12.7802 14.4115 12.7802 14.3781ZM14.0241 14.2687C14.0035 14.2481 13.9907 14.221 13.9878 14.192C13.9849 14.163 13.9922 14.1339 14.0084 14.1097C14.0246 14.0854 14.0487 14.0676 14.0766 14.0591C14.1045 14.0507 14.1344 14.0521 14.1613 14.0633C14.1883 14.0745 14.2105 14.0946 14.2242 14.1204C14.2379 14.1461 14.2423 14.1758 14.2366 14.2043C14.2308 14.2329 14.2154 14.2586 14.1928 14.2771C14.1703 14.2955 14.142 14.3056 14.1128 14.3055C14.0796 14.3055 14.0477 14.2922 14.0241 14.2687ZM11.6098 14.2687C11.5893 14.2482 11.5767 14.2213 11.5739 14.1925C11.5711 14.1637 11.5784 14.1348 11.5945 14.1108C11.6106 14.0868 11.6345 14.0691 11.6622 14.0607C11.6899 14.0524 11.7196 14.0539 11.7464 14.065C11.7731 14.0761 11.7951 14.0961 11.8087 14.1216C11.8223 14.1471 11.8267 14.1766 11.821 14.2049C11.8154 14.2333 11.8 14.2588 11.7777 14.2772C11.7553 14.2955 11.7273 14.3055 11.6983 14.3055C11.6651 14.3054 11.6333 14.2922 11.6098 14.2687ZM12.7802 14.0235C12.7802 13.9986 12.7875 13.9742 12.8014 13.9535C12.8152 13.9328 12.8349 13.9167 12.8579 13.9072C12.8809 13.8976 12.9062 13.8951 12.9306 13.9C12.9551 13.9049 12.9775 13.9168 12.9951 13.9345C13.0127 13.9521 13.0247 13.9745 13.0296 13.9989C13.0344 14.0233 13.0319 14.0487 13.0224 14.0717C13.0129 14.0947 12.9967 14.1143 12.976 14.1282C12.9553 14.142 12.931 14.1494 12.9061 14.1494C12.8727 14.1494 12.8407 14.1361 12.817 14.1125C12.7934 14.0889 12.7802 14.0569 12.7802 14.0235ZM10.9311 14.0109C10.7712 13.851 10.7754 13.5874 10.9405 13.4222C11.1056 13.257 11.3691 13.2529 11.5292 13.413C11.6892 13.573 11.6849 13.8364 11.5198 14.0015C11.4801 14.0415 11.433 14.0733 11.381 14.095C11.329 14.1168 11.2733 14.128 11.2169 14.1281C11.1639 14.1284 11.1114 14.1182 11.0624 14.098C11.0133 14.0779 10.9688 14.0482 10.9313 14.0108L10.9311 14.0109ZM14.2914 14.0015C14.1263 13.8364 14.1221 13.5729 14.282 13.413C14.4419 13.2531 14.7055 13.2571 14.8707 13.4222C15.0359 13.5873 15.04 13.851 14.8801 14.0109C14.8425 14.0483 14.7979 14.0779 14.7489 14.0981C14.6998 14.1182 14.6473 14.1284 14.5942 14.1281C14.5379 14.128 14.4822 14.1167 14.4303 14.095C14.3783 14.0733 14.3312 14.0415 14.2915 14.0015H14.2914ZM12.7804 13.67C12.7804 13.6451 12.7878 13.6207 12.8017 13.6C12.8155 13.5793 12.8352 13.5632 12.8582 13.5536C12.8812 13.5441 12.9065 13.5416 12.9309 13.5465C12.9553 13.5513 12.9778 13.5633 12.9954 13.5809C13.013 13.5985 13.025 13.621 13.0298 13.6454C13.0347 13.6698 13.0322 13.6951 13.0227 13.7181C13.0131 13.7411 12.997 13.7608 12.9763 13.7746C12.9556 13.7885 12.9313 13.7959 12.9064 13.7959C12.8897 13.7959 12.8732 13.7926 12.8578 13.7862C12.8424 13.7798 12.8285 13.7704 12.8167 13.7585C12.805 13.7467 12.7958 13.7327 12.7895 13.7172C12.7832 13.7018 12.7801 13.6852 12.7803 13.6686L12.7804 13.67ZM12.4699 12.9733C12.4699 12.8896 12.4947 12.8079 12.5412 12.7384C12.5877 12.6689 12.6537 12.6147 12.731 12.5828C12.8082 12.5508 12.8932 12.5424 12.9752 12.5588C13.0572 12.5751 13.1325 12.6154 13.1916 12.6745C13.2508 12.7336 13.291 12.809 13.3073 12.891C13.3236 12.973 13.3152 13.058 13.2832 13.1352C13.2512 13.2125 13.197 13.2785 13.1275 13.3249C13.058 13.3714 12.9763 13.3962 12.8926 13.3962C12.8371 13.3962 12.7821 13.3852 12.7308 13.364C12.6795 13.3427 12.6329 13.3116 12.5936 13.2723C12.5544 13.233 12.5232 13.1864 12.502 13.1351C12.4808 13.0838 12.4699 13.0288 12.4699 12.9733ZM13.7266 13.2479C13.7062 13.2274 13.6935 13.2005 13.6907 13.1717C13.6879 13.1429 13.6952 13.114 13.7113 13.09C13.7274 13.0659 13.7513 13.0482 13.779 13.0399C13.8067 13.0315 13.8365 13.033 13.8632 13.0441C13.8899 13.0552 13.9119 13.0752 13.9255 13.1007C13.9392 13.1263 13.9435 13.1557 13.9378 13.1841C13.9322 13.2125 13.9168 13.238 13.8945 13.2563C13.8721 13.2747 13.8441 13.2847 13.8151 13.2847C13.7819 13.2846 13.7501 13.2713 13.7266 13.2479ZM11.8866 13.2384C11.866 13.2178 11.8531 13.1907 11.8502 13.1617C11.8472 13.1327 11.8545 13.1036 11.8706 13.0793C11.8868 13.055 11.9109 13.0371 11.9388 13.0287C11.9667 13.0202 11.9966 13.0216 12.0236 13.0328C12.0505 13.0439 12.0728 13.0641 12.0865 13.0898C12.1002 13.1155 12.1046 13.1452 12.0989 13.1738C12.0932 13.2024 12.0777 13.2281 12.0552 13.2466C12.0326 13.265 12.0043 13.2751 11.9752 13.275C11.942 13.275 11.9102 13.2618 11.8866 13.2384Z"
										fill="url(#paint0_linear_9856_12099)" />
								</g>
								<defs>
									<linearGradient
										id="paint0_linear_9856_12099"
										x1="3.59914"
										y1="3.46179"
										x2="22.0991"
										y2="23.2118"
										gradientUnits="userSpaceOnUse">
										<stop stop-color="#4D2FE5" />
										<stop offset="0.53" stop-color="#D51FD5" />
										<stop offset="1" stop-color="#FB767C" />
									</linearGradient>
									<clipPath id="clip0_9856_12099">
										<rect
											width="25"
											height="25"
											fill="white"
											transform="translate(0.418945 0.894775)" />
									</clipPath>
								</defs>
							</svg>
						</a>
					</div>
					<p>Code Crow Corp © 2023</p>
					<p class="text-gray-500">v0.0.1 [beta]</p>
				</div>
			</footer>
		</div>
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

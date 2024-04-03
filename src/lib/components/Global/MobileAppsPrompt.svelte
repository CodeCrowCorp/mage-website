<script lang="ts">
	import { is_apps_modal_open } from '$lib/stores/helperStore'
	import IconMobileAppiOS from '$lib/assets/icons/social/IconMobileAppiOS.svg'
	import IconMobileAppAndroid from '$lib/assets/icons/social/IconMobileAppAndroid.png'
	import IconDesktopAppWindows from '$lib/assets/icons/social/IconDesktopAppWindows.svg'
</script>

<div
	class="modal {$is_apps_modal_open ? 'modal-open' : ''}"
	on:click={() => {
		$is_apps_modal_open = false
	}}>
	<div
		class="modal-box relative"
		on:click={(e) => {
			e.stopPropagation()
		}}>
		<h3 class="font-bold text-lg">Download the apps</h3>
		<div class="py-4 space-y-2 px-4 md:px-10">
			<a href="https://www.microsoft.com/store/productId/9NL59CNMQG0Q?ocid=pdpshare" target="_blank"
				><img
					alt="Get it from Microsoft"
					src={IconDesktopAppWindows}
					class="w-full h-full p-6" /></a>
			<!-- <a href="" target="_blank">
				<img alt="Get it on Google Play" src={IconMobileAppAndroid} class="grayscale" />
			</a>
			<a href="" target="_blank">
				<img
					src={IconMobileAppiOS}
					alt="Download on the App Store"
					class="w-full h-full p-6 grayscale" />
			</a> -->
			<div style="position: relative;">
				<img alt="Get it on Google Play" src={IconMobileAppAndroid} class="grayscale" />
				<div class="badge badge-warning gap-2 absolute top-4 right-0">coming soon</div>
			</div>
			<div style="position: relative;">
				<img
					src={IconMobileAppiOS}
					alt="Download on the App Store"
					class="w-full h-full p-6 grayscale" />
				<div class="badge badge-warning gap-2 absolute top-4 right-0">coming soon</div>
			</div>
		</div>
		<div class="modal-action">
			<button class="btn" on:click={() => ($is_apps_modal_open = false)}>Close</button>
		</div>
	</div>
</div>

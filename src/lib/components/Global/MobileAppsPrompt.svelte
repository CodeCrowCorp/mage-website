<script lang="ts">
	import { is_apps_modal_open } from '$lib/stores/helperStore'
	import IconMobileAppiOS from '$lib/assets/icons/social/IconMobileAppiOS.svg'
	import IconMobileAppAndroid from '$lib/assets/icons/social/IconMobileAppAndroid.png'
</script>

<div
	class="modal cursor-pointer {$is_apps_modal_open ? 'modal-open' : ''}"
	on:click={() => {
		$is_apps_modal_open = false
	}}>
	<div
		class="modal-box relative"
		on:click={(e) => {
			e.stopPropagation()
		}}>
		<h3 class="font-bold text-lg">Download the mobile app</h3>
		<div class="py-4 space-y-5 px-4 md:px-10">
			<a
				href="https://play.google.com/store/apps/details?id=com.google.android.apps.messaging&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
				><img alt="Get it on Google Play" src={IconMobileAppAndroid} /></a>
			<a
				href="https://apps.apple.com/us/app/telegram-messenger/id686449807?itsct=apps_box_badge&amp;itscg=30200">
				<img src={IconMobileAppiOS} alt="Download on the App Store" class="w-full h-full p-8" /></a>
		</div>
		<div class="modal-action">
			<button class="btn" on:click={() => ($is_apps_modal_open = false)}>Close</button>
		</div>
	</div>
</div>

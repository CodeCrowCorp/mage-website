<script>
	// @ts-nocheck
	// @ts-ignore
	import Calendar from '@event-calendar/core'
	import TimeGrid from '@event-calendar/time-grid'
	import { get, put, del } from '$lib/api'
	import { page } from '$app/stores'
	import { getWeekNumber } from '$lib/utils'
	import Field from '$lib/components/Profile/Elements/Field.svelte'
	import moment from 'moment'

	export let profileId
	const plugins = [TimeGrid]

	let formData = {}
	let loading = false
	let formClass = ''
	let optionClass = ''
	let ec

	$: auth = {
		userId: $page.data.user?.userId,
		token: $page.data.user?.token
	}

	// apis call methods

	const createEvent = async () => {
		const payload = {
			...formData,
			startDate: new Date(formData.startDate).getTime(),
			duration: new Date(formData.duration).getTime()
		}
		loading = true
		await put(
			`schedule`,
			{
				...payload
			},
			auth
		)
		loading = false
		hideForm()
		ec.refetchEvents()
	}

	const removeEvent = async () => {
		loading = true
		await del(`schedule${formData.id ? '?scheduleId=' + formData.id : ''}`)
		ec.refetchEvents()
		hideOptions()
		formData = {}
		loading = false
	}

	const getEvents = async (date) => {
		loading = true
		const wn = getWeekNumber(date)
		let resp = await get(`/schedules?userId=${profileId}&weekNumber=${wn}`)
		loading = false
		return resp.map((i) => ({
			title: i.text,
			start: new Date(i.startDate),
			end: new Date(i.duration),
			id: i._id,
			editable: true
		}))
	}

	const onClick = ({ event }) => {
		formData.text = event.title
		formData.startDate = moment(event.start).format('YYYY-MM-DDTHH:MM')
		formData.duration = moment(event.end).format('YYYY-MM-DDTHH:MM')
		formData.id = event.id
		showOptions()
	}

	// form and options methods

	const showForm = () => {
		hideOptions()
		formClass = 'modal-open'
	}

	const hideForm = () => {
		formClass = ''
	}

	const showOptions = () => {
		optionClass = 'modal-open'
	}

	const hideOptions = () => {
		optionClass = ''
	}
</script>

<div class="bg-white p-8 rounded">
	<!-- Form component -->
	<div class="flex justify-between mb-4">
		<span />
		<button class="btn" on:click={showForm}>Add Event</button>

		<dialog class={'modal ' + formClass}>
			<form method="dialog" class="modal-box event-form">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={hideForm}
					>✕</button>
				<h3 class="font-bold text-lg mb-8">{formData.id ? 'Edit Event' : 'Add Event'}</h3>
				<Field label="Title" bind:value={formData.text} type="text" />
				<Field
					label="Start Date"
					bind:value={formData.startDate}
					type="datetime-local"
					onChange={() => (formData.duration = '')} />
				<Field
					label="End Date"
					bind:value={formData.duration}
					type="datetime-local"
					attr={{
						min: formData.startDate
					}} />
				<div class="modal-action">
					<!-- if there is a button in form, it will close the modal -->
					<button disabled={loading} class="btn" on:click={hideForm}>Close</button>
					<button disabled={loading} class="btn" type="button" on:click={createEvent}>Save</button>
				</div>
			</form>
		</dialog>
	</div>

	<!-- Options -->

	<dialog class={'modal ' + optionClass}>
		<form method="dialog" class="modal-box px-0">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				on:click={() => {
					hideOptions()
					formData = {}
				}}>✕</button>
			<h3 class="font-bold text-lg">Options</h3>
			<ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full">
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={showForm}><a>Edit</a></li>
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={removeEvent}><a>Remove</a></li>
			</ul>
		</form>
	</dialog>

	<dialog class={'modal ' + (loading ? 'modal-open' : '')}>
		<span class="loading loading-spinner loading-lg" />
	</dialog>

	<Calendar
		{plugins}
		options={{
			eventClick: onClick,
			loading,
			lazyFetching: true,
			eventSources: [
				{
					events: async (dates) => {
						return await getEvents(dates.start)
					}
				}
			],
			dragScroll: true,
			headerToolbar: {
				start: 'title',
				center: '',
				end: 'prev,next,today,timeGridWeek,timeGridDay'
			},
			allDaySlot: false,
			dayHeaderFormat: (date) => {
				return `${moment(date).format('ddd DD')}`
			},
			titleFormat: (start, end) => {
				return `${moment(start).format('MMMM YYYY')}`
			},
			listDaySideFormat: (date) => `test`
		}}
		onChange
		bind:this={ec} />
</div>

<style global lang="postcss">
	.ec {
		@apply border rounded-md overflow-hidden;
	}
	.ec-toolbar {
		@apply mb-0 bg-gray-200 py-3 px-6;
	}
	.ec-title {
		@apply font-semibold text-gray-800;
	}
	.ec-days {
		/* @apply  */
	}
	.ec-day {
		@apply py-4 text-gray-800;
	}

	.ec-body:not(.ec-compact) .ec-line:nth-child(even):after {
		@apply border-solid;
	}

	.ec-line:not(:first-child):after {
		@apply border-b-gray-800/5;
	}
  .ec-time, .ec-line{
    /* @apply h-12 */
  }
</style>

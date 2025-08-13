<!-- Meetup Check-In Event Page -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { navigationStore, navigationActions } from '$lib/stores';
	import WelcomeScreen from '$lib/screens/WelcomeScreen.svelte';
	import CheckinForm from '$lib/screens/CheckinForm.svelte';
	import ConfirmationScreen from '$lib/screens/ConfirmationScreen.svelte';
	
	let { data }: { data: PageData } = $props();
	
	let event = $derived(data.event);
	let navigationState = $derived($navigationStore);

	onMount(() => {
		if (event) {
			navigationActions.setEvent(event.url_id);
		}
	});
</script>

<svelte:head>
	<title>{event?.title || 'Loading...'} - Check In</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

{#if navigationState.currentScreen === 'welcome'}
	<WelcomeScreen 
		{event} 
		isLoading={navigationState.isLoading}
		error={navigationState.error}
	/>
{:else if navigationState.currentScreen === 'checkin'}
	<CheckinForm 
		{event} 
		isLoading={navigationState.isLoading}
		error={navigationState.error}
	/>
{:else if navigationState.currentScreen === 'confirmation'}
	<ConfirmationScreen 
		{event} 
		isLoading={navigationState.isLoading}
		error={navigationState.error}
	/>
{/if}


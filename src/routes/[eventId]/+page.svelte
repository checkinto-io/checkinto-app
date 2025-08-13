<!-- Meetup Check-In Event Page -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { navigationStore, navigationActions } from '$lib/stores';
	import WelcomeScreen from '$lib/screens/WelcomeScreen.svelte';
	import CheckinForm from '$lib/screens/CheckinForm.svelte';
	
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
	<!-- TODO: Add ConfirmationScreen component -->
	<div class="placeholder">
		<h2>Confirmation Screen (Coming Soon)</h2>
		<p>Event: {event?.title}</p>
	</div>
{/if}

<style>
	.placeholder {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		text-align: center;
	}

	.placeholder h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.placeholder p {
		font-size: 1.2rem;
		opacity: 0.9;
	}
</style>
<!-- Meetup Check-In Event Page -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { Event as MeetupEvent } from '$lib/types.js';
	
	export let data: PageData;
	
	$: event = data.event;
	
	function handleCheckIn(): void {
		// TODO: Navigate to check-in form
		console.log('Check-in clicked for event:', event.id);
	}
</script>

<svelte:head>
	<title>{event.title} - Check In</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="container">
	<div class="welcome-card">
		<h1 class="title">{event.title}</h1>
		<p class="welcome-message">{event.welcome_message}</p>
		
		<button class="check-in-btn" type="button" on:click={handleCheckIn}>
			Check In
		</button>
	</div>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.welcome-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		text-align: center;
		max-width: 500px;
		width: 100%;
	}

	.title {
		font-size: 2rem;
		font-weight: bold;
		color: #2d3748;
		margin-bottom: 1rem;
	}

	.welcome-message {
		font-size: 1.1rem;
		color: #4a5568;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.check-in-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		font-weight: bold;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		width: 100%;
		max-width: 200px;
	}

	.check-in-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
	}

	.check-in-btn:active {
		transform: translateY(0);
	}

	/* Mobile optimization */
	@media (max-width: 640px) {
		.container {
			padding: 0.5rem;
		}
		
		.welcome-card {
			padding: 1.5rem;
		}
		
		.title {
			font-size: 1.75rem;
		}
	}
</style>
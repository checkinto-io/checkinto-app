<script lang="ts">
	import { Button } from '$lib/components';
	import { navigationActions, formActions } from '$lib/stores';
	import type { MeetupEvent } from '$lib/types';

	interface Props {
		event: MeetupEvent | null;
		isLoading?: boolean;
		error?: string | null;
	}

	let { event, isLoading = false, error = null }: Props = $props();

	const handleNewCheckIn = () => {
		formActions.reset();
		navigationActions.goToScreen('welcome');
	};
</script>

<div class="confirmation-screen">
	{#if isLoading}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Processing check-in...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<h1>Check-in Error</h1>
			<p>{error}</p>
			<Button variant="secondary" onclick={handleNewCheckIn}>
				Try Again
			</Button>
		</div>
	{:else if event}
		<div class="confirmation-content">
			<header class="success-header">
				{#if event.meetup?.logo}
					<div class="logo-container">
						<img src="/images/meetup/{event.meetup.logo}" alt={event.meetup.name} class="meetup-logo" />
					</div>
				{/if}
				<div class="success-icon">
					<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
						<polyline points="22,4 12,14.01 9,11.01"/>
					</svg>
				</div>
				<h1 class="success-title">You're Checked In!</h1>
			</header>

			<main class="confirmation-main">
				<div class="event-info">
					<h2 class="event-name">{event.title}</h2>
				</div>

				<div class="venue-info">
					{#if event.venue}
						<div class="venue-details">
							<h3 class="venue-name">{event.venue.name}</h3>
							<p class="venue-description">{event.venue.description}</p>
							
							{#if event.venue.learn_more_link}
								<div class="venue-link">
									<a href={event.venue.learn_more_link} target="_blank" rel="noopener noreferrer">Learn more</a>
								</div>
							{/if}
						</div>
					{/if}

					<div class="info-grid">
						{#if event.venue?.wifi_access}
							<div class="info-item">
								<div class="info-icon">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
										<path d="M1 10c6.63-6.63 17.37-6.63 24 0"/>
										<path d="M5 14c4.42-4.42 11.58-4.42 16 0"/>
										<path d="M9 18c2.21-2.21 5.79-2.21 8 0"/>
									</svg>
								</div>
								<div class="info-content">
									<h4>WiFi Access</h4>
									<p>{event.venue.wifi_access}</p>
								</div>
							</div>
						{/if}

						{#if event.venue?.restroom_details}
							<div class="info-item">
								<div class="info-icon">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
										<polyline points="9,22 9,12 15,12 15,22"/>
									</svg>
								</div>
								<div class="info-content">
									<h4>Restrooms</h4>
									<p>{event.venue.restroom_details}</p>
								</div>
							</div>
						{/if}

						{#if event.venue?.food_details}
							<div class="info-item">
								<div class="info-icon">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
										<path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
										<line x1="6" y1="1" x2="6" y2="4"/>
										<line x1="10" y1="1" x2="10" y2="4"/>
										<line x1="14" y1="1" x2="14" y2="4"/>
									</svg>
								</div>
								<div class="info-content">
									<h4>Refreshments</h4>
									<p>{event.venue.food_details}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</main>
		</div>
	{:else}
		<div class="error-state">
			<h1>Event Not Found</h1>
			<p>Unable to load event information.</p>
			<Button variant="secondary" onclick={handleNewCheckIn}>
				Start Over
			</Button>
		</div>
	{/if}
</div>

<style>
	.confirmation-screen {
		min-height: 100vh;
		background: linear-gradient(135deg, #20c05b 0%, #16a34a 100%);
		padding: 15px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		color: white;
		box-sizing: border-box;
	}

	.confirmation-content {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
		text-align: center;
	}

	.success-header {
		margin-bottom: 2rem;
	}

	.logo-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.meetup-logo {
		width: 100%;
		max-width: 500px;
		height: auto;
		border-radius: 10px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.success-icon {
		margin: 0 auto 1rem;
		width: 64px;
		height: 64px;
		color: white;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	.success-title {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.confirmation-main {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.event-info {
		margin-bottom: 1rem;
	}

	.event-name {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		opacity: 0.95;
	}


	.venue-info {
		background: #e2e2e2;
		color: #374151;
		border-radius: 1rem;
		padding: 2rem;
		text-align: left;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	}

	.venue-details {
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.venue-name {
		font-size: 1.25rem;
		font-weight: bold;
		margin: 0 0 0.75rem 0;
		color: #1f2937;
	}

	.venue-description {
		font-size: 0.95rem;
		color: #6b7280;
		line-height: 1.5;
		margin: 0 0 1rem 0;
	}

	.venue-link {
		margin-top: 1rem;
	}

	.venue-link a {
		color: #059669;
		text-decoration: underline;
		font-size: 0.9rem;
	}

	.venue-link a:hover {
		color: #047857;
	}

	.info-grid {
		display: grid;
		gap: 1.5rem;
	}

	.info-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.info-icon {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		background: #f3f4f6;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #059669;
	}

	.info-content h4 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.25rem 0;
		color: #1f2937;
	}

	.info-content p {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
		line-height: 1.4;
	}



	/* Loading and error states */
	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
		max-width: 400px;
	}

	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top: 3px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.error-state h1 {
		font-size: 1.5rem;
		margin: 0;
		color: #fca5a5;
	}

	.error-state p {
		margin: 0;
		opacity: 0.9;
	}

	/* Mobile optimization */
	@media (max-width: 640px) {
		.confirmation-screen {
			padding: 15px;
		}
		
		.success-title {
			font-size: 2rem;
		}
		
		.venue-info {
			padding: 1.5rem;
		}
		
		.info-grid {
			gap: 1rem;
		}
		
		.info-item {
			gap: 0.75rem;
		}
	}

	/* Larger screens - show info grid in 2 columns */
	@media (min-width: 640px) {
		.info-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
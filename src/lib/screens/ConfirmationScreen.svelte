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

	const handleCheckInAnother = () => {
		formActions.reset();
		navigationActions.reset(); // This now clears localStorage and resets to initial state
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
				<h1 class="success-title">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="success-icon-inline">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
						<polyline points="22,4 12,14.01 9,11.01"/>
					</svg>
					You're checked in!
				</h1>
			</header>

			<main class="confirmation-main">
				<div class="event-info-grid">
					<!-- Meetup -->
					{#if event.meetup}
						<div class="info-item">
							<div class="info-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
									<circle cx="9" cy="7" r="4"/>
									<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
									<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
								</svg>
							</div>
							<div class="info-content">
								<h4>Meetup</h4>
								{#if event.meetup.learn_more_link}
									<p><a href={event.meetup.learn_more_link} target="_blank" rel="noopener noreferrer">{event.meetup.name}</a></p>
								{:else}
									<p>{event.meetup.name}</p>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Event -->
					<div class="info-item">
						<div class="info-icon">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
								<line x1="16" y1="2" x2="16" y2="6"/>
								<line x1="8" y1="2" x2="8" y2="6"/>
								<line x1="3" y1="10" x2="21" y2="10"/>
							</svg>
						</div>
						<div class="info-content">
							<h4>Event</h4>
							<p>{event.title}</p>
						</div>
					</div>

					<!-- Presenter -->
					{#if event.presenter}
						<div class="info-item">
							<div class="info-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
									<circle cx="12" cy="7" r="4"/>
								</svg>
							</div>
							<div class="info-content">
								<h4>Presenter</h4>
								{#if event.presenter.learn_more_link}
									<p><a href={event.presenter.learn_more_link} target="_blank" rel="noopener noreferrer">{event.presenter.first_name} {event.presenter.last_name}</a></p>
								{:else}
									<p>{event.presenter.first_name} {event.presenter.last_name}</p>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Workshop Host -->
					{#if event.workshop_host}
						<div class="info-item">
							<div class="info-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
									<circle cx="12" cy="7" r="4"/>
								</svg>
							</div>
							<div class="info-content">
								<h4>Workshop Host</h4>
								{#if event.workshop_host.learn_more_link}
									<p><a href={event.workshop_host.learn_more_link} target="_blank" rel="noopener noreferrer">{event.workshop_host.first_name} {event.workshop_host.last_name}</a></p>
								{:else}
									<p>{event.workshop_host.first_name} {event.workshop_host.last_name}</p>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Venue -->
					{#if event.venue}
						<div class="info-item">
							<div class="info-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<!-- Building base -->
									<rect x="4" y="6" width="16" height="16" rx="1"/>
									<!-- Windows -->
									<rect x="7" y="9" width="2" height="2"/>
									<rect x="11" y="9" width="2" height="2"/>
									<rect x="15" y="9" width="2" height="2"/>
									<rect x="7" y="13" width="2" height="2"/>
									<rect x="11" y="13" width="2" height="2"/>
									<rect x="15" y="13" width="2" height="2"/>
									<!-- Door -->
									<rect x="10" y="17" width="4" height="5"/>
									<!-- Roof -->
									<path d="M4 6l8-4 8 4"/>
								</svg>
							</div>
							<div class="info-content">
								<h4>Venue</h4>
								{#if event.venue.learn_more_link}
									<p class="venue-name"><a href={event.venue.learn_more_link} target="_blank" rel="noopener noreferrer">{event.venue.name}</a></p>
								{:else}
									<p class="venue-name">{event.venue.name}</p>
								{/if}
								<p class="venue-description">{event.venue.description}</p>
							</div>
						</div>
					{/if}

					<!-- WiFi Access -->
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

					<!-- Restrooms -->
					{#if event.venue?.restroom_details}
						<div class="info-item">
							<div class="info-icon">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<!-- Toilet tank (taller) -->
									<rect x="7" y="2" width="10" height="8" rx="1"/>
									<!-- Toilet bowl rim -->
									<ellipse cx="12" cy="10" rx="8" ry="2.5"/>
									<!-- Toilet bowl -->
									<path d="M4 10v8c0 3 3.5 5 8 5s8-2 8-5v-8"/>
									<!-- Toilet seat (closed) -->
									<ellipse cx="12" cy="10" rx="6" ry="1.5" fill="none"/>
									<!-- Tank handle -->
									<circle cx="16" cy="6" r="1"/>
								</svg>
							</div>
							<div class="info-content">
								<h4>Restrooms</h4>
								<p>{event.venue.restroom_details}</p>
							</div>
						</div>
					{/if}

					<!-- Refreshments -->
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

				<div class="check-in-another">
					<Button variant="secondary" onclick={handleCheckInAnother}>
						Check In Another Person
					</Button>
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

	.success-title {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.success-icon-inline {
		color: white;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
		flex-shrink: 0;
	}

	.confirmation-main {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.event-info-grid {
		background: #e2e2e2;
		color: #374151;
		border-radius: 1rem;
		padding: 2rem;
		text-align: left;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		display: grid;
		gap: 1.5rem;
	}

	.venue-name {
		font-weight: bold;
		margin: 0 0 0.25rem 0;
		color: #1f2937;
	}

	.venue-description {
		font-size: 0.875rem;
		color: #6b7280;
		line-height: 1.4;
		margin: 0 0 0.5rem 0;
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

	.info-content a {
		color: #059669;
		text-decoration: underline;
	}

	.info-content a:hover {
		color: #047857;
	}

	.check-in-another {
		margin-top: 2rem;
		text-align: center;
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
			gap: 0.5rem;
		}

		.success-icon-inline {
			width: 36px;
			height: 36px;
		}
		
		.event-info-grid {
			padding: 1.5rem;
			gap: 1rem;
		}
		
		.info-item {
			gap: 0.75rem;
		}
	}

	/* Larger screens - show info grid in 2 columns */
	@media (min-width: 640px) {
		.event-info-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
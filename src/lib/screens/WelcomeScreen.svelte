<script lang="ts">
	import { Button } from '$lib/components';
	import { navigationActions } from '$lib/stores';
	import type { MeetupEvent } from '$lib/types';

	interface Props {
		event: MeetupEvent | null;
		isLoading?: boolean;
		error?: string | null;
	}

	let { event, isLoading = false, error = null }: Props = $props();

	const handleCheckIn = () => {
		navigationActions.startCheckin();
	};
</script>

<div class="welcome-screen">
	{#if isLoading}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Loading event...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<h1>Event Not Available</h1>
			<p>{error}</p>
		</div>
	{:else if event}
		<div class="welcome-content">
			<header class="welcome-header">
				<h1 class="event-title">{event.title}</h1>
			</header>

			<main class="welcome-main">
				<div class="welcome-message">
					<p>{event.welcome_message}</p>
				</div>

				<div class="check-in-action">
					<Button
						variant="primary"
						size="large"
						onclick={handleCheckIn}
					>
						Check In
					</Button>
				</div>
			</main>
		</div>
	{:else}
		<div class="error-state">
			<h1>Event Not Found</h1>
			<p>This event could not be found or is no longer active.</p>
		</div>
	{/if}
</div>

<style>
	.welcome-screen {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		text-align: center;
	}

	.welcome-content {
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
	}

	.welcome-header {
		margin-bottom: 2rem;
	}

	.event-title {
		font-size: 2rem;
		font-weight: bold;
		margin: 0;
		line-height: 1.2;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	@media (min-width: 640px) {
		.event-title {
			font-size: 2.5rem;
		}
	}

	.welcome-main {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.welcome-message {
		font-size: 1.125rem;
		line-height: 1.6;
		opacity: 0.95;
	}

	.welcome-message p {
		margin: 0;
	}

	.check-in-action {
		display: flex;
		justify-content: center;
	}

	/* Loading and error states */
	.loading-state,
	.error-state {
		text-align: center;
		max-width: 400px;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
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
		margin: 0 0 1rem 0;
		color: #fca5a5;
	}

	.error-state p {
		margin: 0;
		opacity: 0.9;
	}
</style>
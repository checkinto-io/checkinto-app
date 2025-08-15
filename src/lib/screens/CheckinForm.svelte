<script lang="ts">
	import { Button, Input, TextArea } from '$lib/components';
	import { formStore, formActions, navigationActions } from '$lib/stores';
	import { DatabaseService } from '$lib/database';
	import { getImagePath, IMAGE_CATEGORIES } from '$lib/utils/imagePaths';
	import type { MeetupEvent, AttendeeInput } from '$lib/types';

	interface Props {
		event: MeetupEvent | null;
		isLoading?: boolean;
		error?: string | null;
	}

	let { event, error = null }: Props = $props();
	
	let formState = $derived($formStore);

	const handleFieldChange = (field: 'firstName' | 'lastName' | 'email' | 'interestingFact', value: string) => {
		// Pass eventId for email uniqueness checking
		const eventId = field === 'email' && event ? event.id : undefined;
		formActions.updateField(field, value, eventId);
	};

	const handleSubmit = async () => {
		// Validate all fields first
		formActions.validateAll();
		
		// Check if form is valid
		if (!formState.isValid || !event) {
			return;
		}

		try {
			formActions.setSubmitting(true);
			
			// Prepare attendee data for database
			const attendeeData: AttendeeInput = {
				first_name: formState.data.firstName,
				last_name: formState.data.lastName,
				email: formState.data.email,
				interesting_fact: formState.data.interestingFact
			};
			
			// Submit to database
			const result = await DatabaseService.checkInAttendee(event.id, attendeeData);
			
			if (result.success) {
				// Show appropriate success message based on whether attendee was already registered
				if (result.isExistingAttendee) {
					console.log('Attendee information updated for existing registration');
				} else {
					console.log('New attendee successfully checked in');
				}
				
				// Store email before reset for raffle winner comparison
				const checkedInEmail = formState.data.email;
				// Reset form and navigate to confirmation
				formActions.reset();
				navigationActions.completeCheckin(event, checkedInEmail);
			} else {
				// Handle submission error with specific error message
				const errorMessage = result.error || 'Failed to complete check-in. Please try again.';
				console.error('Check-in failed:', errorMessage);
				navigationActions.setError(errorMessage);
			}
		} catch (err) {
			console.error('Form submission error:', err);
			navigationActions.setError('An error occurred during check-in. Please try again.');
		} finally {
			formActions.setSubmitting(false);
		}
	};

	const handleBack = () => {
		formActions.reset();
		navigationActions.goToScreen('welcome');
	};
</script>

<div class="checkin-form-screen">
	{#if error}
		<div class="error-state">
			<h1>Unable to Load Form</h1>
			<p>{error}</p>
			<Button variant="secondary" onclick={handleBack}>
				Back to Welcome
			</Button>
		</div>
	{:else if event}
		<div class="form-container">
			<header class="form-header">
				{#if event.meetup?.logo}
					<div class="logo-container">
						<img src={getImagePath(event.meetup.logo, IMAGE_CATEGORIES.GROUP)} alt={event.meetup.name} class="meetup-logo" />
					</div>
				{/if}
				<h1 class="form-title">Checking In To</h1>
				<p class="event-name">"{event.title}"</p>
			</header>

			<main class="form-main">
				<form class="checkin-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
					<div class="form-fields">
						<Input
							id="firstName"
							label="First Name"
							type="text"
							autocomplete="given-name"
							required
							bind:value={formState.data.firstName}
							error={formState.validation.firstName}
							oninput={(value: string) => handleFieldChange('firstName', value)}
							disabled={formState.isSubmitting}
						/>

						<Input
							id="lastName"
							label="Last Name"
							type="text"
							autocomplete="family-name"
							required
							bind:value={formState.data.lastName}
							error={formState.validation.lastName}
							oninput={(value: string) => handleFieldChange('lastName', value)}
							disabled={formState.isSubmitting}
						/>

						<Input
							id="email"
							label="Email Address"
							type="email"
							autocomplete="email"
							required
							bind:value={formState.data.email}
							error={formState.validation.email}
							oninput={(value: string) => handleFieldChange('email', value)}
							disabled={formState.isSubmitting}
						/>

						<TextArea
							id="interestingFact"
							label="Share something interesting about yourself"
							required
							maxlength={255}
							rows={3}
							bind:value={formState.data.interestingFact}
							error={formState.validation.interestingFact}
							oninput={(value: string) => handleFieldChange('interestingFact', value)}
							disabled={formState.isSubmitting}
						/>

						<Button
							type="submit"
							variant="primary"
							size="large"
							disabled={!formState.isValid || formState.isSubmitting}
							loading={formState.isSubmitting}
						>
							{formState.isSubmitting ? 'Checking In...' : 'Check In'}
						</Button>
					</div>
				</form>
			</main>
		</div>
	{:else}
		<div class="error-state">
			<h1>Event Not Found</h1>
			<p>Unable to load event information.</p>
		</div>
	{/if}
</div>

<style>
	.checkin-form-screen {
		min-height: 100vh;
		background: linear-gradient(135deg, var(--color-primary-gradient-start) 0%, var(--color-primary-gradient-end) 100%);
		padding: 15px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.form-container {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		flex: 1;
		padding-top: 0;
	}

	.form-header {
		color: white;
		margin-bottom: 2rem;
		text-align: center;
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
		box-shadow: 0 4px 12px var(--shadow-base);
	}

	.form-title {
		font-size: 2rem;
		font-weight: bold;
		margin: 0 0 0.5rem 0;
		text-shadow: 0 2px 4px var(--shadow-text);
	}

	.event-name {
		font-size: 1.1rem;
		opacity: 0.9;
		margin: 0;
	}

	.form-main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.checkin-form {
		background: var(--color-content-bg);
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 10px 25px var(--shadow-light);
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	.form-fields {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* Error state */
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: white;
		gap: 1rem;
		flex: 1;
		max-width: 400px;
		margin: 0 auto;
	}

	.error-state h1 {
		font-size: 1.5rem;
		margin: 0;
		color: var(--color-error-text);
	}

	.error-state p {
		margin: 0;
		opacity: 0.9;
	}

	/* Mobile optimization */
	@media (max-width: 640px) {
		.checkin-form-screen {
			padding: 15px;
		}
		
		.checkin-form {
			padding: 1.5rem;
		}
		
		.form-title {
			font-size: 1.75rem;
		}
	}

	/* Ensure form takes full height on mobile */
	@media (max-height: 700px) {
		.form-main {
			justify-content: center;
		}
	}
</style>
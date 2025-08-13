<script lang="ts">
	type ButtonVariant = 'primary' | 'secondary';
	type ButtonSize = 'small' | 'medium' | 'large';

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		disabled?: boolean;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: () => void;
		children: any;
	}

	let {
		variant = 'primary',
		size = 'medium',
		disabled = false,
		loading = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseClasses = 'btn-base';

	const variantClasses = {
		primary: 'btn-primary',
		secondary: 'btn-secondary'
	};

	const sizeClasses = {
		small: 'btn-small',
		medium: 'btn-medium',
		large: 'btn-large'
	};

	const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
</script>

<button
	{type}
	class={classes}
	{disabled}
	onclick={onclick}
>
	{#if loading}
		<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-current inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
		Loading...
	{:else}
		{@render children()}
	{/if}
</button>
<script lang="ts">
	interface Props {
		id: string;
		label: string;
		type?: 'text' | 'email' | 'tel' | 'password';
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		autocomplete?: string;
		class?: string;
		// eslint-disable-next-line no-unused-vars
		onchange?: (_value: string) => void;
		// eslint-disable-next-line no-unused-vars
		oninput?: (_value: string) => void;
	}

	let {
		id,
		label,
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		required = false,
		disabled = false,
		error = '',
		autocomplete,
		class: className = '',
		onchange,
		oninput
	}: Props = $props();

	const handleInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		value = target.value;
		oninput?.(target.value);
	};

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		onchange?.(target.value);
	};
</script>

<div class="w-full {className}">
	<label for={id} class="block text-base font-medium text-gray-700 mb-2">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
	
	<input
		{id}
		{type}
		{placeholder}
		{required}
		{disabled}
		{value}
		oninput={handleInput}
		onchange={handleChange}
		class="input-field {error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}"
		aria-invalid={error ? 'true' : 'false'}
		aria-describedby={error ? `${id}-error` : undefined}
		autocomplete={autocomplete as any}
	/>
	
	{#if error}
		<p id="{id}-error" class="mt-2 text-sm text-red-600" role="alert">
			{error}
		</p>
	{/if}
</div>
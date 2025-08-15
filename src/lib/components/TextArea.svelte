<script lang="ts">
	interface Props {
		id: string;
		label: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		maxlength?: number;
		rows?: number;
		class?: string;
		// eslint-disable-next-line no-unused-vars
		onchange?: (_value: string) => void;
		// eslint-disable-next-line no-unused-vars
		oninput?: (_value: string) => void;
	}

	let {
		id,
		label,
		value = $bindable(''),
		placeholder = '',
		required = false,
		disabled = false,
		error = '',
		maxlength = 255,
		rows = 3,
		class: className = '',
		onchange,
		oninput
	}: Props = $props();

	let remainingChars = $derived(maxlength - value.length);

	const handleInput = (event: Event) => {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		oninput?.(target.value);
	};

	const handleChange = (event: Event) => {
		const target = event.target as HTMLTextAreaElement;
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
	
	<textarea
		{id}
		{placeholder}
		{required}
		{disabled}
		{maxlength}
		{rows}
		{value}
		oninput={handleInput}
		onchange={handleChange}
		class="input-field resize-none {error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}"
		aria-invalid={error ? 'true' : 'false'}
		aria-describedby={error ? `${id}-error` : `${id}-hint`}
	></textarea>
	
	<div class="mt-2 flex justify-between items-center">
		<div id="{id}-hint" class="text-base text-gray-500">
			{remainingChars} characters remaining
		</div>
		
		{#if error}
			<p id="{id}-error" class="text-sm text-red-600" role="alert">
				{error}
			</p>
		{/if}
	</div>
</div>
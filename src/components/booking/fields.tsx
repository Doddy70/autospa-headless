'use client';

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

/**
 * The form controls of the wizard.
 *
 * The project has no form kit - the fields are plain elements styled with the
 * AutoSPA tokens, the same way the native booking form on `/reservasi` does
 * it. Every control carries its own label, so the wizard stays usable with a
 * screen reader and with the browser autofill.
 */

/** The base look of every control. */
export const controlClass =
	'w-full rounded-xl border border-white/10 bg-background-8 px-4 py-3 text-sm text-white transition-colors placeholder:text-white/30 focus:border-primary-500 focus:outline-none disabled:opacity-50';

export interface FieldProps {
	label: string;
	/** The id of the control the label belongs to. */
	htmlFor: string;
	error?: string | undefined;
	hint?: ReactNode;
	required?: boolean;
	children: ReactNode;
	className?: string;
}

/** A label, a control and the error message below it. */
export function Field({
	label,
	htmlFor,
	error,
	hint,
	required,
	children,
	className,
}: FieldProps) {
	return (
		<div className={cn('block', className)}>
			<label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-white">
				{label}
				{required ? <span className="text-primary-500"> *</span> : null}
			</label>

			{children}

			{hint && !error ? <p className="mt-2 text-xs text-white/40">{hint}</p> : null}

			{error ? (
				<p role="alert" className="mt-2 text-xs text-ns-red">
					{error}
				</p>
			) : null}
		</div>
	);
}

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	id: string;
	error?: string | undefined;
	hint?: ReactNode;
}

export function TextInput({ label, id, error, hint, className, required, ...props }: TextInputProps) {
	return (
		<Field label={label} htmlFor={id} error={error} hint={hint} required={required}>
			<input
				id={id}
				aria-invalid={error ? true : undefined}
				className={cn(controlClass, error && 'border-ns-red', className)}
				required={required}
				{...props}
			/>
		</Field>
	);
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	id: string;
	error?: string | undefined;
	hint?: ReactNode;
	children: ReactNode;
}

export function Select({ label, id, error, hint, className, required, children, ...props }: SelectProps) {
	return (
		<Field label={label} htmlFor={id} error={error} hint={hint} required={required}>
			<select
				id={id}
				aria-invalid={error ? true : undefined}
				className={cn(controlClass, 'appearance-none', error && 'border-ns-red', className)}
				required={required}
				{...props}
			>
				{children}
			</select>
		</Field>
	);
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label: string;
	id: string;
	error?: string | undefined;
	hint?: ReactNode;
}

export function TextArea({ label, id, error, hint, className, ...props }: TextAreaProps) {
	return (
		<Field label={label} htmlFor={id} error={error} hint={hint}>
			<textarea
				id={id}
				aria-invalid={error ? true : undefined}
				className={cn(controlClass, 'resize-y', error && 'border-ns-red', className)}
				{...props}
			/>
		</Field>
	);
}

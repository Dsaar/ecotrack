import { useState } from "react";

/**
 * Simple reusable form hook with Joi schema support.
 *
 * @param {Object} initialValues - initial form data
 * @param {Joi.Schema} schema - Joi object schema (optional)
 * @param {Function} onSubmit - async function(data) called when valid
 */
export default function useForm(initialValues, schema, onSubmit) {
	const [data, setData] = useState(initialValues);
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;

		setData((prev) => ({
			...prev,
			[name]: value,
		}));

		// clear error for this field when user edits
		if (errors[name]) {
			setErrors((prev) => {
				const updated = { ...prev };
				delete updated[name];
				return updated;
			});
		}
	};

	const validate = () => {
		if (!schema) return null;

		const { error } = schema.validate(data, {
			abortEarly: false,
		});

		if (!error) return null;

		const validationErrors = {};
		for (const detail of error.details) {
			const field = detail.path[0];
			if (!validationErrors[field]) {
				validationErrors[field] = detail.message;
			}
		}

		return validationErrors;
	};

	const handleSubmit = async (e) => {
		if (e && e.preventDefault) {
			e.preventDefault();
		}

		const validationErrors = validate();
		setErrors(validationErrors || {});

		if (validationErrors) return;

		await onSubmit(data);
	};

	const resetForm = (nextInitialValues = initialValues) => {
		setData(nextInitialValues);
		setErrors({});
	};

	return {
		data,
		setData,
		errors,
		setErrors,
		handleChange,
		handleSubmit,
		validate,
		resetForm,
	};
}

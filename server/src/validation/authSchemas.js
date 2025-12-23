import Joi from "joi";

// password regex from your brief
export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

export const registerSchema = Joi.object({
	name: Joi.object({
		first: Joi.string()
			.min(2)
			.max(256)
			.required()
			.messages({
				"string.base": "First name must be text.",
				"string.empty": "First name is required.",
				"string.min": "First name must be at least 2 characters.",
				"string.max": "First name must be at most 256 characters.",
				"any.required": "First name is required.",
			}),
		middle: Joi.string()
			.allow("")
			.max(256)
			.messages({
				"string.base": "Middle name must be text.",
				"string.max": "Middle name must be at most 256 characters.",
			}),
		last: Joi.string()
			.min(2)
			.max(256)
			.required()
			.messages({
				"string.base": "Last name must be text.",
				"string.empty": "Last name is required.",
				"string.min": "Last name must be at least 2 characters.",
				"string.max": "Last name must be at most 256 characters.",
				"any.required": "Last name is required.",
			}),
	})
		.required()
		.messages({
			"object.base": "Name must be an object.",
			"any.required": "Name is required.",
		}),

	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			"string.base": "Email must be text.",
			"string.empty": "Email is required.",
			"string.email": "Email must be a valid email address.",
			"any.required": "Email is required.",
		}),

	password: Joi.string()
		.pattern(passwordRegex)
		.required()
		.messages({
			"string.base": "Password must be text.",
			"string.empty": "Password is required.",
			"string.pattern.base":
				"Password must be at least 8 characters and include uppercase, lowercase, number, and a special character.",
			"any.required": "Password is required.",
		}),

	avatarUrl: Joi.object({
		url: Joi.string()
			.uri()
			.allow("")
			.messages({
				"string.base": "Avatar URL must be text.",
				"string.uri": "Avatar URL must be a valid URL.",
			}),
		alt: Joi.string()
			.allow("")
			.max(256)
			.messages({
				"string.base": "Avatar alt text must be text.",
				"string.max": "Avatar alt text must be at most 256 characters.",
			}),
	})
		.optional()
		.messages({
			"object.base": "Avatar must be an object.",
		}),

	phone: Joi.string()
		.allow("")
		.max(50)
		.messages({
			"string.base": "Phone must be text.",
			"string.max": "Phone must be at most 50 characters.",
		}),

	address: Joi.object({
		state: Joi.string()
			.allow("")
			.messages({
				"string.base": "State must be text.",
			}),
		country: Joi.string()
			.min(2)
			.max(256)
			.required()
			.messages({
				"string.base": "Country must be text.",
				"string.empty": "Country is required.",
				"string.min": "Country must be at least 2 characters.",
				"string.max": "Country must be at most 256 characters.",
				"any.required": "Country is required.",
			}),
		city: Joi.string()
			.min(2)
			.max(256)
			.required()
			.messages({
				"string.base": "City must be text.",
				"string.empty": "City is required.",
				"string.min": "City must be at least 2 characters.",
				"string.max": "City must be at most 256 characters.",
				"any.required": "City is required.",
			}),
		street: Joi.string()
			.min(2)
			.max(256)
			.required()
			.messages({
				"string.base": "Street must be text.",
				"string.empty": "Street is required.",
				"string.min": "Street must be at least 2 characters.",
				"string.max": "Street must be at most 256 characters.",
				"any.required": "Street is required.",
			}),
		houseNumber: Joi.number()
			.required()
			.messages({
				"number.base": "House number must be a number.",
				"any.required": "House number is required.",
			}),
		zip: Joi.number()
			.optional()
			.messages({
				"number.base": "ZIP must be a number.",
			}),
	})
		.optional()
		.messages({
			"object.base": "Address must be an object.",
		}),
}).messages({
	"object.base": "Body must be a valid object.",
});

export const loginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			"string.base": "Email must be text.",
			"string.empty": "Email is required.",
			"string.email": "Email must be a valid email address.",
			"any.required": "Email is required.",
		}),
	password: Joi.string()
		.required()
		.messages({
			"string.base": "Password must be text.",
			"string.empty": "Password is required.",
			"any.required": "Password is required.",
		}),
}).messages({
	"object.base": "Body must be a valid object.",
});

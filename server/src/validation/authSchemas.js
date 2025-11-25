import Joi from "joi";

// password regex from your brief
export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

export const registerSchema = Joi.object({
	name: Joi.object({
		first: Joi.string().min(2).max(256).required(),
		middle: Joi.string().allow("").max(256),
		last: Joi.string().min(2).max(256).required()
	}).required(),

	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),

	password: Joi.string()
		.pattern(passwordRegex)
		.required(),

	avatarUrl: Joi.object({
		url: Joi.string()
			.uri()
			.allow(""),
		alt: Joi.string().allow("").max(256)
	}).optional(),

	phone: Joi.string().allow("").max(50),

	address: Joi.object({
		state: Joi.string().allow(""),
		country: Joi.string().min(2).max(256).required(),
		city: Joi.string().min(2).max(256).required(),
		street: Joi.string().min(2).max(256).required(),
		houseNumber: Joi.number().required(),
		zip: Joi.number().optional()
	}).optional()
});

export const loginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	password: Joi.string().required()
});

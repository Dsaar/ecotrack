import Joi from "joi";

// Password policy per brief: at least 8 chars, 1 upper, 1 lower, 1 number, 1 symbol
export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

export const registerSchema = Joi.object({
	name: Joi.string().min(2).max(100).required(),
	email: Joi.string().email({ tlds: { allow: false } }).required(),
	password: Joi.string().pattern(passwordRegex).required().messages({
		"string.pattern.base":
			"Password must be 8+ chars and include upper, lower, number, and symbol.",
	}),
});

export const loginSchema = Joi.object({
	email: Joi.string().email({ tlds: { allow: false } }).required(),
	password: Joi.string().required(),
});

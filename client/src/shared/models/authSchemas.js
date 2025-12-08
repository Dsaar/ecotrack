// src/shared/models/authSchemas.js
import Joi from "joi";

export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

// 🔐 Login form schema (flat – matches the front-end form)
export const loginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.label("Email"),

	password: Joi.string().required().label("Password"),
});

// 📝 Register form schema (flat – matches your RegisterForm state)
export const registerSchema = Joi.object({
	firstName: Joi.string().min(2).max(256).required().label("First name"),
	middleName: Joi.string().allow("").max(256).label("Middle name"),
	lastName: Joi.string().min(2).max(256).required().label("Last name"),

	phone: Joi.string().allow("").max(50).label("Phone"),

	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.label("Email"),

	password: Joi.string()
		.pattern(passwordRegex)
		.required()
		.label("Password")
		.messages({
			"string.pattern.base":
				"Password must have upper, lower, number and a symbol, min 8 characters.",
		}),

	confirmPassword: Joi.any()
		.valid(Joi.ref("password"))
		.required()
		.label("Confirm password")
		.messages({
			"any.only": "Passwords must match.",
		}),

	avatarUrl: Joi.string().uri().allow("").label("Avatar URL"),
	avatarAlt: Joi.string().allow("").max(256).label("Avatar description"),

	country: Joi.string().min(2).max(256).required().label("Country"),
	state: Joi.string().allow("").label("State"),
	city: Joi.string().min(2).max(256).required().label("City"),
	street: Joi.string().min(2).max(256).required().label("Street"),
	houseNumber: Joi.number().required().label("House number"),
	zip: Joi.number().allow(null, "").label("ZIP code"),
});

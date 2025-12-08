// src/shared/models/registerSchema.js
import Joi from "joi";

export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

const registerSchema = Joi.object({
	firstName: Joi.string().min(2).max(256).required().label("First name"),
	middleName: Joi.string().allow("").max(256).label("Middle name"),
	lastName: Joi.string().min(2).max(256).required().label("Last name"),

	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.label("Email"),

	password: Joi.string().pattern(passwordRegex).required().label("Password"),

	confirmPassword: Joi.any()
		.equal(Joi.ref("password"))
		.required()
		.label("Confirm password")
		.messages({
			"any.only": "Passwords must match",
		}),

	phone: Joi.string().allow("").max(50).label("Phone"),

	avatarUrl: Joi.string().uri().allow("").label("Avatar URL"),
	avatarAlt: Joi.string().allow("").max(256).label("Avatar alt text"),

	country: Joi.string().min(2).max(256).required().label("Country"),
	city: Joi.string().min(2).max(256).required().label("City"),
	street: Joi.string().min(2).max(256).required().label("Street"),
	state: Joi.string().allow("").label("State / Region"),

	// ✅ allow empty string OR number
	zip: Joi.alternatives()
		.try(Joi.number(), Joi.string().allow(""))
		.optional()
		.label("ZIP code"),

	houseNumber: Joi.number().required().label("House number"),
});

export default registerSchema;

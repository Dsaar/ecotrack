// src/shared/models/loginSchema.js
import Joi from "joi";

const loginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.label("Email"),

	password: Joi.string().required().label("Password"),
});

export default loginSchema;

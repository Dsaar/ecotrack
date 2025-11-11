export const validate = (schema, source = "body") => (req, res, next) => {
	const toValidate = req[source];
	const { error, value } = schema.validate(toValidate, {
		abortEarly: false,
		stripUnknown: true,
	});
	if (error) {
		return res.status(400).json({ message: "Validation failed", details: error.details });
	}
	req[source] = value;
	next();
};

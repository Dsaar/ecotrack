export const validate = (schema, source = "body") => (req, res, next) => {
	// Decide what to validate based on source
	let toValidate;
	switch (source) {
		case "query":
			toValidate = req.query;
			break;
		case "params":
			toValidate = req.params;
			break;
		case "body":
		default:
			toValidate = req.body;
			break;
	}

	const { error, value } = schema.validate(toValidate, {
		abortEarly: false,
		stripUnknown: true,
	});

	if (error) {
		return res
			.status(400)
			.json({ message: "Validation failed", details: error.details });
	}

	// Mutate the existing object instead of reassigning (req.query is a getter)
	let target;
	switch (source) {
		case "query":
			target = req.query;
			break;
		case "params":
			target = req.params;
			break;
		case "body":
		default:
			target = req.body;
			break;
	}

	// Clear existing keys
	Object.keys(target).forEach((key) => delete target[key]);
	// Copy validated values in
	Object.assign(target, value);

	next();
};

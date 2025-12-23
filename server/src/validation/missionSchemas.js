import Joi from "joi";

const estImpactSchema = Joi.object({
	co2Kg: Joi.number()
		.min(0)
		.default(0)
		.messages({
			"number.base": "CO₂ impact must be a number.",
			"number.min": "CO₂ impact cannot be negative.",
		}),
	waterL: Joi.number()
		.min(0)
		.default(0)
		.messages({
			"number.base": "Water impact must be a number.",
			"number.min": "Water impact cannot be negative.",
		}),
	wasteKg: Joi.number()
		.min(0)
		.default(0)
		.messages({
			"number.base": "Waste impact must be a number.",
			"number.min": "Waste impact cannot be negative.",
		}),
}).messages({
	"object.base": "Estimated impact must be an object.",
});

const submissionFieldSchema = Joi.object({
	key: Joi.string().required().messages({
		"string.base": "Submission field key must be text.",
		"string.empty": "Submission field key is required.",
		"any.required": "Submission field key is required.",
	}),
	label: Joi.string().required().messages({
		"string.base": "Submission field label must be text.",
		"string.empty": "Submission field label is required.",
		"any.required": "Submission field label is required.",
	}),
	type: Joi.string()
		.valid("text", "number", "select", "url", "file")
		.default("text")
		.messages({
			"string.base": "Submission field type must be text.",
			"any.only": "Submission field type must be one of: text, number, select, url, file.",
		}),
	required: Joi.boolean().default(true).messages({
		"boolean.base": "Submission field 'required' must be true/false.",
	}),
	options: Joi.array()
		.items(Joi.string().messages({ "string.base": "Option must be text." }))
		.default([])
		.messages({
			"array.base": "Options must be an array of strings.",
		}),
}).messages({
	"object.base": "Submission field must be an object.",
});

export const createMissionSchema = Joi.object({
	title: Joi.string()
		.min(3)
		.max(100)
		.required()
		.messages({
			"string.base": "Title must be text.",
			"string.empty": "Title is required.",
			"string.min": "Title must be at least 3 characters.",
			"string.max": "Title must be at most 100 characters.",
			"any.required": "Title is required.",
		}),

	slug: Joi.string()
		.min(3)
		.max(100)
		.required()
		.messages({
			"string.base": "Slug must be text.",
			"string.empty": "Slug is required.",
			"string.min": "Slug must be at least 3 characters.",
			"string.max": "Slug must be at most 100 characters.",
			"any.required": "Slug is required.",
		}),

	summary: Joi.string()
		.min(10)
		.max(220)
		.required()
		.messages({
			"string.base": "Summary must be text.",
			"string.empty": "Summary is required.",
			"string.min": "Summary must be at least 10 characters.",
			"string.max": "Summary must be at most 220 characters.",
			"any.required": "Summary is required.",
		}),

	description: Joi.string()
		.min(20)
		.required()
		.messages({
			"string.base": "Description must be text.",
			"string.empty": "Description is required.",
			"string.min": "Description must be at least 20 characters.",
			"any.required": "Description is required.",
		}),

	category: Joi.string()
		.valid("Home", "Transport", "Food", "Energy", "Waste", "Water", "Community")
		.default("Home")
		.messages({
			"string.base": "Category must be text.",
			"any.only":
				"Category must be one of: Home, Transport, Food, Energy, Waste, Water, Community.",
		}),

	difficulty: Joi.string()
		.valid("Easy", "Medium", "Hard")
		.default("Easy")
		.messages({
			"string.base": "Difficulty must be text.",
			"any.only": "Difficulty must be one of: Easy, Medium, Hard.",
		}),

	estImpact: estImpactSchema
		.default({ co2Kg: 0, waterL: 0, wasteKg: 0 })
		.messages({
			"object.base": "Estimated impact must be an object.",
		}),

	duration: Joi.string()
		.default("15 min")
		.messages({
			"string.base": "Duration must be text (example: '15 min' or '1.5 hours').",
		}),

	imageUrl: Joi.string()
		.uri()
		.allow("")
		.messages({
			"string.base": "Image URL must be text.",
			"string.uri": "Image URL must be a valid URL.",
		}),

	requiresSubmission: Joi.boolean()
		.default(true)
		.messages({
			"boolean.base": "Requires submission must be true/false.",
		}),

	submissionSchema: Joi.array()
		.items(submissionFieldSchema)
		.default([])
		.messages({
			"array.base": "Submission schema must be an array of fields.",
		}),

	points: Joi.number()
		.integer()
		.min(0)
		.default(10)
		.messages({
			"number.base": "Points must be a number.",
			"number.integer": "Points must be a whole number.",
			"number.min": "Points cannot be negative.",
		}),

	tags: Joi.array()
		.items(Joi.string().messages({ "string.base": "Tag must be text." }))
		.default([])
		.messages({
			"array.base": "Tags must be an array of strings.",
		}),

	isPublished: Joi.boolean()
		.default(true)
		.messages({
			"boolean.base": "Published must be true/false.",
		}),
}).messages({
	"object.base": "Body must be a valid object.",
});

export const updateMissionSchema = createMissionSchema.fork(
	Object.keys(createMissionSchema.describe().keys),
	(schema) => schema.optional()
);

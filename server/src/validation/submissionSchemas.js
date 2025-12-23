import Joi from "joi";

export const objectId = () =>
	Joi.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.messages({
			"string.base": "ID must be text.",
			"string.pattern.base": "ID must be a valid MongoDB ObjectId.",
		});

export const createSubmissionSchema = Joi.object({
	missionId: objectId()
		.required()
		.messages({
			"any.required": "Mission ID is required.",
		}),

	answers: Joi.array()
		.items(
			Joi.object({
				key: Joi.string().required().messages({
					"string.base": "Answer key must be text.",
					"string.empty": "Answer key is required.",
					"any.required": "Answer key is required.",
				}),
				value: Joi.alternatives(Joi.string(), Joi.number())
					.required()
					.messages({
						"alternatives.match": "Answer value must be text or a number.",
						"any.required": "Answer value is required.",
					}),
			}).messages({
				"object.base": "Each answer must be an object.",
			})
		)
		.default([])
		.messages({
			"array.base": "Answers must be an array.",
		}),

	evidenceUrls: Joi.array()
		.items(
			Joi.string()
				.uri()
				.messages({
					"string.base": "Evidence URL must be text.",
					"string.uri": "Evidence URL must be a valid URL.",
				})
		)
		.default([])
		.messages({
			"array.base": "Evidence URLs must be an array of valid URLs.",
		}),
}).messages({
	"object.base": "Body must be a valid object.",
});

export const listAdminSubmissionsQuery = Joi.object({
	status: Joi.string()
		.valid("pending", "approved", "rejected")
		.default("pending")
		.messages({
			"string.base": "Status must be text.",
			"any.only": "Status must be one of: pending, approved, rejected.",
		}),
	missionId: objectId(),
	userId: objectId(),
	page: Joi.number()
		.min(1)
		.default(1)
		.messages({
			"number.base": "Page must be a number.",
			"number.min": "Page must be at least 1.",
		}),
	limit: Joi.number()
		.min(1)
		.max(100)
		.default(20)
		.messages({
			"number.base": "Limit must be a number.",
			"number.min": "Limit must be at least 1.",
			"number.max": "Limit cannot be greater than 100.",
		}),
}).messages({
	"object.base": "Query must be a valid object.",
});

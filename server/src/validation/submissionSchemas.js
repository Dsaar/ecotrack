import Joi from "joi";

export const objectId = () => Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const createSubmissionSchema = Joi.object({
	missionId: objectId().required(),
	answers: Joi.array()
		.items(
			Joi.object({
				key: Joi.string().required(),
				value: Joi.alternatives(Joi.string(), Joi.number()).required(),
			})
		)
		.default([]),
	evidenceUrls: Joi.array().items(Joi.string().uri()).default([]),
});

export const listAdminSubmissionsQuery = Joi.object({
	status: Joi.string().valid("pending", "approved", "rejected").default("pending"),
	missionId: objectId(),
	userId: objectId(),
	page: Joi.number().min(1).default(1),
	limit: Joi.number().min(1).max(100).default(20),
});

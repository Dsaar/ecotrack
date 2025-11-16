import Joi from "joi";

const estImpactSchema = Joi.object({
	co2Kg: Joi.number().min(0).default(0),
	waterL: Joi.number().min(0).default(0),
	wasteKg: Joi.number().min(0).default(0),
});

export const createMissionSchema = Joi.object({
	title: Joi.string().min(3).max(100).required(),
	slug: Joi.string().min(3).max(100).required(),
	summary: Joi.string().min(10).max(220).required(),
	description: Joi.string().min(20).required(),
	category: Joi.string()
		.valid("Home", "Transport", "Food", "Energy", "Waste", "Water", "Community")
		.default("Home"),
	difficulty: Joi.string().valid("Easy", "Medium", "Hard").default("Easy"),
	estImpact: estImpactSchema.default({}),
	duration: Joi.string().default("15 min"),
	imageUrl: Joi.string().uri().allow(""),
	requiresSubmission: Joi.boolean().default(true),
	submissionSchema: Joi.array()
		.items(
			Joi.object({
				key: Joi.string().required(),
				label: Joi.string().required(),
				type: Joi.string()
					.valid("text", "number", "select", "url", "file")
					.default("text"),
				required: Joi.boolean().default(true),
				options: Joi.array().items(Joi.string()).default([]),
			})
		)
		.default([]),
	points: Joi.number().integer().min(0).default(10),
	tags: Joi.array().items(Joi.string()).default([]),
	isPublished: Joi.boolean().default(true),
});

export const updateMissionSchema = createMissionSchema.fork(
	Object.keys(createMissionSchema.describe().keys),
	(schema) => schema.optional()
);

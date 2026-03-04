import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader({
			// Normalize Windows backslashes to forward slashes to prevent duplicate IDs
			// when the same file is matched multiple times due to path normalization
			generateId: ({ entry }) => entry.replace(/\\/g, '/').replace(/\.[^.]+$/, ''),
		}),
		schema: docsSchema({
			extend: z.object({
				domain: z
					.enum([
						'Secure RAG',
						'Agent Security',
						'Threat Modelling',
						'LLM Gateway Patterns',
						'Red Teaming',
						'Governance and Assurance',
					])
					.optional(),
				contentType: z.enum(['essay', 'guide', 'lab', 'reference']).optional(),
				version: z.string().optional(),
				status: z.enum(['draft', 'review', 'stable', 'archived']).optional(),
				lastReviewed: z.coerce.date().optional(),
			}),
		}),
	}),
};

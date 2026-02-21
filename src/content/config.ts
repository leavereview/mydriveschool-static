import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().default('MyDriveSchool Team'),
    category: z.string().optional(),
    skill_number: z.number().optional(),
    howTo: z.object({
      name: z.string(),
      description: z.string(),
      steps: z.array(z.object({
        name: z.string(),
        text: z.string(),
      }))
    }).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};

import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().default('MyDriveSchool Team'),
  }),
});

export const collections = {
  blog: blogCollection,
};

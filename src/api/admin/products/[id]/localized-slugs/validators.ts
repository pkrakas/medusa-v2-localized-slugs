import { z } from "@medusajs/framework/zod";

export const PostLocalizedSlugsSchema = z.array(z.object({
    locale: z.string(),
    slug: z.string()
}))

export type PostLocalizedSlugs = z.infer<typeof PostLocalizedSlugsSchema>
import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework";
import { PostLocalizedSlugsSchema } from "./admin/products/[id]/localized-slugs/validators";

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/products/:id/localized-slugs",
            methods: ["POST"],
            middlewares: [
                validateAndTransformBody(PostLocalizedSlugsSchema)
            ]
        }
    ]
})
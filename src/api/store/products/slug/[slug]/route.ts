import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const slug = req.params.slug

    if (!req.locale)
        return res.status(400).json({ error: 'Please provide locale in "x-medusa-locale" header or "locale" query parameter.' })

    if (!slug)
        return res.status(400).json({ error: 'Please provide product slug.' })

    const query = req.scope.resolve("query")

    const { data: localized_slug } = await query.graph({
        entity: "localized_slugs",
        fields: ["*", "product.*", "product.images.*", "product.variants.*", "product.variants.images.*", "product.options.*"],
        filters: {
            locale: req.locale,
            slug
        },
    }, {
        locale: req.locale
    })

    if (!localized_slug?.length)
        return res.status(404).json({ error: "Localized slug not found." })
    
    res.json(localized_slug[0])
}
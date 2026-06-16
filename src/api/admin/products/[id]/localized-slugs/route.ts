import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { upsertLocalizedSlugsWorkflow } from "../../../../../workflows/upsert-localized_slugs-workflow"
import { PostLocalizedSlugs } from "./validators"

export const POST = async (
    req: MedusaRequest<PostLocalizedSlugs>,
    res: MedusaResponse
) => {
    const product_id = req.params.id

    const input = req.validatedBody?.map(arr => ({...arr, product_id}))

    const { result } = await upsertLocalizedSlugsWorkflow(req.scope).run({
        input
    })

    res.json(result)

}
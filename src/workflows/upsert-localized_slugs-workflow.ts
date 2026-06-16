import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { LOCALIZED_SLUGS_MODULE } from "../modules/localized-slugs"
import type LocalizedSlugsModuleService from "../modules/localized-slugs/service"

type UpsertLocalizedSlugsInput = {
    product_id: string,
    locale: string,
    slug: string
}[]

const upsertLocalizedSlugsStep = createStep("upsert-localized_slugs-step",
    async (input: UpsertLocalizedSlugsInput, { container }) => {

        const localizedSlugsModule = container.resolve<LocalizedSlugsModuleService>(LOCALIZED_SLUGS_MODULE)
        
        const localizedSlugs = await localizedSlugsModule.upsertLocalizedSlugs(input)

        return new StepResponse(localizedSlugs, localizedSlugs.map(localizedSlug => localizedSlug.id))
    }, async (idsArray: string[], { container }) => {
        if (Array.isArray(idsArray) && !idsArray.length)
            return;

        const localizedSlugsModule = container.resolve<LocalizedSlugsModuleService>(LOCALIZED_SLUGS_MODULE)

        await localizedSlugsModule.deleteLocalizedSlugs(idsArray)

    })

export const upsertLocalizedSlugsWorkflow = createWorkflow("upsert-localized_slugs-workflow", (input: UpsertLocalizedSlugsInput) => {
    
    const localizedSlugs = upsertLocalizedSlugsStep(input)

    return new WorkflowResponse(localizedSlugs)
})
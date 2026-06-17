import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { LOCALIZED_SLUGS_MODULE } from "../modules/localized-slugs"
import type LocalizedSlugsService from "../modules/localized-slugs/service"

export default async function handleProductDeleted({
    event,
    container,
}: SubscriberArgs<{ id: string }>) {
    const localizedSlugsService = container.resolve<LocalizedSlugsService>(LOCALIZED_SLUGS_MODULE)
    const slugs = await localizedSlugsService.listLocalizedSlugs({
        product_id: event.data.id,
    })
    if (slugs.length) {
        await localizedSlugsService.deleteLocalizedSlugs(slugs.map((s) => s.id))
    }
}
export const config: SubscriberConfig = {
    event: "product.deleted",
}
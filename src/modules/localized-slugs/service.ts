import { MedusaService } from "@medusajs/framework/utils";
import { LocalizedSlug } from "./models/localized-slug";

type UpsertLocalizedSlugInput = {
    product_id: string
    locale: string
    slug: string
}

class LocalizedSlugsService extends MedusaService({
    LocalizedSlug
}) {
    async upsertLocalizedSlugs(data: UpsertLocalizedSlugInput[]) {
        if (!data.length)
            return [];

        const productIds = [...new Set(data.map(d => d.product_id))]

        const existing = await this.listLocalizedSlugs({
            product_id: productIds
        })

        const byKey = new Map(
            existing.map((row) => [`${row.product_id}:${row.locale}`, row])
        )
        const toCreate: UpsertLocalizedSlugInput[] = []
        const toUpdate: { id: string; slug: string }[] = []
        const toDelete: string[] = []

        for (const item of data) {
            const key = `${item.product_id}:${item.locale}`
            const found = byKey.get(key)
            item.slug = item.slug.trim()

            if (item.slug === "") {
                if (found) {
                    toDelete.push(found.id)
                }
                continue
            }

            if (!found) {
                toCreate.push(item)
                continue
            }

            if (found.slug !== item.slug) {
                toUpdate.push({ id: found.id, slug: item.slug })
            }
        }

        const created = toCreate.length
            ? await this.createLocalizedSlugs(toCreate)
            : []
        const updated = toUpdate.length
            ? await this.updateLocalizedSlugs(toUpdate)
            : []
        if(toDelete.length)
            await this.deleteLocalizedSlugs(toDelete)
        
        return [...created, ...updated]
    }
}

export default LocalizedSlugsService
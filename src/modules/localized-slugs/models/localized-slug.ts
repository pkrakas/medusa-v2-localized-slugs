import { model } from "@medusajs/framework/utils";

export const LocalizedSlug = model.define("localized_slug", {
    id: model.id().primaryKey(),
    product_id: model.text(),
    locale: model.text(),
    slug: model.text()
}).indexes([
    {
        name: "idx_localized_slug_product_locale",
        on: ["product_id", "locale"],
        unique: true,
    },
    {
        name: "idx_localized_slug_locale_slug",
        on: ["locale", "slug"],
        unique: true
    }
])
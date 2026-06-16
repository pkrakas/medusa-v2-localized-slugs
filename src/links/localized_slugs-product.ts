import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import LocalizedSlugsModule from "../modules/localized-slugs"

export default defineLink(
    {
      linkable: LocalizedSlugsModule.linkable.localizedSlug,
      field: "product_id"
    },
    ProductModule.linkable.product,
    {
      readOnly: true,
    }
)  
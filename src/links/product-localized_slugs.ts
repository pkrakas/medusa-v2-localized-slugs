import LocalizedSlugsModule from "../modules/localized-slugs"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    field: "id",
  },
  {
    ...LocalizedSlugsModule.linkable.localizedSlug.id,
    primaryKey: "product_id",
  },
  {
    readOnly: true,
    isList: true
  }
)
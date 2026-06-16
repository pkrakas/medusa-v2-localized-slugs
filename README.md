# @jellyfish/v2-localized-slugs

Medusa v2 plugin that adds **per-locale URL slugs** for products. Store each product's slug per locale (e.g. `en-US` → `bosch-cordless-drill`, `lt-LT` → `akumuliatorinis-suktuvas-bosch`) and resolve products by slug on the storefront.

Works alongside Medusa's [Translation module](https://docs.medusajs.com/resources/commerce-modules/translation) for translated product content.

## Features

- **Custom module** (`localized_slugs`) with unique constraints on `(product_id, locale)` and `(locale, slug)`
- **Admin widget** on the product detail page to view and edit slugs per store locale
- **Admin API** to upsert slugs in bulk
- **Store API** to fetch a product by localized slug + locale
- **Product link** — query products with `+localized_slugs.*` or traverse `localized_slugs → product`
- **Upsert semantics** — create, update, or delete (empty slug removes the row)

## Requirements

- Node.js >= 20
- Medusa **v2.15.x** (`@medusajs/medusa`, `@medusajs/framework`, etc.)
- [Translation module](https://docs.medusajs.com/resources/commerce-modules/translation) enabled (recommended for locale-aware storefronts)

## Installation

### 1. Add the plugin to your Medusa backend

```bash
npm install @jellyfish/v2-localized-slugs
```

### 2. Register in `medusa-config.ts`

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/translation",
    },
  ],
  plugins: [
    {
      resolve: "@jellyfish/v2-localized-slugs",
      options: {},
    },
  ],
  featureFlags: {
    translation: true,
  },
})
```

### 3. Run migrations

From your Medusa backend app:

```bash
npx medusa db:migrate
```

### 4. Enable locales in Admin

Under **Settings → Translations**, add the locales your store supports. The admin widget reads `supported_locales` from the store and shows one slug input per locale.

## Data model

| Field        | Description                                |
|-------------|--------------------------------------------|
| `id`        | Primary key                                |
| `product_id`| Linked product ID                          |
| `locale`    | BCP 47 locale code (e.g. `en-US`, `lt-LT`) |
| `slug`      | URL-safe slug unique per locale            |

**Indexes:**

- Unique `(product_id, locale)` — one slug per product per locale
- Unique `(locale, slug)` — no duplicate slugs within a locale

## Admin UI

A **Slugs** widget appears on the product detail page (`product.details.before` zone). It:

1. Lists current slugs per locale
2. Opens a drawer with inputs for each store-supported locale
3. Saves via the admin API below

Clearing a slug (empty string) **deletes** that locale's slug row.

## API

### Admin — upsert slugs

```http
POST /admin/products/:id/localized-slugs
Content-Type: application/json
```

**Body** — array of `{ locale, slug }` (product ID comes from the URL):

```json
[
  { "locale": "en-US", "slug": "bosch-cordless-drill" },
  { "locale": "lt-LT", "slug": "akumuliatorinis-suktuvas-bosch" },
  { "locale": "pl-PL", "slug": "" }
]
```

| `slug` value | Behavior                           |
|--------------|------------------------------------|
| non-empty    | Create or update slug for locale   |
| `""`         | Delete slug for locale (if exists) |

**Response:** array of created/updated slug records.

### Store — resolve product by slug

```http
GET /store/products/slug/:slug?locale=lt-LT
```

Or send the locale via header:

```http
GET /store/products/slug/:slug
x-medusa-locale: lt-LT
```

`req.locale` is set by Medusa's `applyLocale` middleware from the query param or header.

**Response:** localized slug record with nested `product` (images, variants, options, etc.).

**Errors:**

| Status | Reason                  |
|--------|-------------------------|
| `400`  | Missing locale or slug  |
| `404`  | No matching slug for locale |

### Query products with slugs (Admin / custom routes)

```ts
const { data } = await query.graph({
  entity: "product",
  fields: ["id", "title", "+localized_slugs.*"],
  filters: { id: productId },
})
```

## Storefront example

There is no built-in `sdk.store.product.retrieveBySlug`. Use `client.fetch`:

```ts
import Medusa from "@medusajs/js-sdk"

const sdk = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const result = await sdk.client.fetch(
  `/store/products/slug/${encodeURIComponent(slug)}`,
  {
    method: "GET",
    headers: { "x-medusa-locale": locale },
  }
)
```

Route your PDP at `/[countryCode]/products/[slug]` (or similar) and pass the same locale you use for translations.

## Locale codes

Use the same locale codes as your store's **supported locales** and Translation module (BCP 47, e.g. `lt-LT`). Slug rows are filtered by exact `locale` match — `lt` and `lt-LT` are different keys.

## License

MIT 

## Author

pkrakas

import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260612125952 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "localized_slug" ("id" text not null, "product_id" text not null, "locale" text not null, "slug" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "localized_slug_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_localized_slug_deleted_at" ON "localized_slug" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_localized_slug_product_locale" ON "localized_slug" ("product_id", "locale") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_localized_slug_locale_slug" ON "localized_slug" ("locale", "slug") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "localized_slug" cascade;`);
  }

}


import { Button, clx, Container, Drawer, Heading, Input, Label, Text, toast } from "@medusajs/ui"
import { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useState } from "react";

type AdminLocalizedSlugs = AdminProduct & {
    localized_slugs: {
        product_id: string
        locale: string
        slug: string
    }[]
}

const LocalizedSlugsWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {

    const [open, setOpen] = useState(false)
    const [slugInputValues, setSlugInputValues] = useState<any>({})

    const { data: queryResult, refetch: refetchLocalizedSlugs } = useQuery({
        queryFn: () => sdk.admin.product.retrieve(product.id, {
            fields: "+localized_slugs.*"
        }),
        queryKey: [["product", product.id]]
    })

    const { data: enabledLocales } = useQuery({
        queryFn: async () => {
            const response = await sdk.admin.store.list({
                limit: 1,
                fields: "id,*supported_locales,*supported_locales.locale"
            })
            const currentStore = response.stores?.[0]
            return currentStore.supported_locales.map(sl => sl.locale_code)
        },
        queryKey: [["supported-locales"]]
    })


    const localizedSlugs = (queryResult?.product as AdminLocalizedSlugs)?.localized_slugs

    const onSubmit = () => {
        sdk.client
            .fetch(`/admin/products/${product.id}/localized-slugs`, {
                method: "POST",
                body: Object.keys(slugInputValues).map(key => ({
                    locale: key,
                    slug: slugInputValues[key]
                }))

            },
            )
            .then(() => {
                toast.success("Slugs updated.")
                setOpen(false)
                refetchLocalizedSlugs()
            })
            .catch(() => {
                toast.error("Failed to update slugs.")
            })
    }

    return (
        <>
            <Container className="divide-y p-0">
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <Heading level="h2">Slugs</Heading>
                    </div>
                    <div>
                        <Button variant="secondary" onClick={() => setOpen(true)}>Edit</Button>
                    </div>
                </div>
                {localizedSlugs?.map(ls => (<div
                    className={clx(
                        `text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`
                    )}
                >
                    <Text size="small" weight="plus" leading="compact">
                        {ls.locale}
                    </Text>

                    <Text
                        size="small"
                        leading="compact"
                        className="whitespace-pre-line text-pretty"
                    >
                        {ls.slug || "-"}
                    </Text>

                </div>))}

            </Container>

            <Drawer open={open} onOpenChange={setOpen}>
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>
                            Edit slugs
                        </Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                        {enabledLocales?.map(localeCode => <div key={localeCode} className="py-1">
                            <Label htmlFor={`locale-code-input-${localeCode}`}>{localeCode}</Label>
                            <Input id={`locale-code-input-${localeCode}`} className="w-full" defaultValue={localizedSlugs?.find(slug => slug.locale === localeCode)?.slug} onChange={(e) => setSlugInputValues((prev: any) => ({ ...prev, [localeCode]: e.target.value }))} />
                        </div>)}
                    </Drawer.Body>
                    <Drawer.Footer>
                        <Button onClick={onSubmit}>Save</Button>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer>
        </>
    )
}

export const config = defineWidgetConfig({
    zone: "product.details.before"
})

export default LocalizedSlugsWidget
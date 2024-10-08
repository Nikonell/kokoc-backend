import { t } from "elysia";

export const basicProduct = t.Object({
    id: t.Number({ minimum: 1 }),
    createdAt: t.Date(),
    name: t.String(),
    price: t.Number(),
    discount: t.Number(),
});
export type BasicProduct = typeof basicProduct.static;

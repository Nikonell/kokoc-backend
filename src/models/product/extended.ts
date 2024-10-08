import { t } from "elysia";
import { basicProduct } from "./basic";

export const extendedProduct = t.Composite([
    basicProduct,
    t.Object({
        image: t.Nullable(t.String()),
    })
]);
export type ExtendedProduct = typeof extendedProduct.static;

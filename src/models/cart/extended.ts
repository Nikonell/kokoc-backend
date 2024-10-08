import { t } from "elysia";
import { basicCart } from "./basic";
import { extendedProduct } from "../product/extended";

export const extendedCart = t.Composite([
    basicCart,
    t.Object({
        products: t.Array(extendedProduct)
    })
]);
export type ExtendedCart = typeof extendedCart.static;

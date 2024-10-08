import { t } from "elysia";

export const addToCart = t.Object({
    productId: t.Number({ minimum: 1 })
});
export type AddToCart = typeof addToCart.static;

export const removeFromCart = t.Object({
    productId: t.Number({ minimum: 1 })
});
export type RemoveFromCart = typeof removeFromCart.static;

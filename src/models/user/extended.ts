import { t } from "elysia";
import { basicUser } from "./basic";
import { basicComment } from "../comment/basic";
import { extendedCart } from "../cart/extended";

// Select
export const extendedUser = t.Composite([
    basicUser,
    t.Object({
        comments: t.Array(basicComment),
        cart: extendedCart
    })
]);
export type SelectUser = typeof extendedUser.static;

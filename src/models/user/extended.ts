import { t } from "elysia";
import { basicUser } from "./basic";
import { basicComment } from "../comment/basic";
import { extendedCart } from "../cart/extended";
import { extendedMatch } from "../match/extended";

// Select
export const extendedUser = t.Composite([
    t.Omit(basicUser, ["viewedMatches"]),
    t.Object({
        comments: t.Array(basicComment),
        cart: extendedCart,
        viewedMatches: t.Array(extendedMatch),
    })
]);
export type SelectUser = typeof extendedUser.static;

import { t } from "elysia";
import { basicUser } from "./basic";
import { basicComment } from "../comment/basic";

// Select
export const extendedUser = t.Composite([
    basicUser,
    t.Object({
        comments: t.Array(basicComment),
    })
]);
export type SelectUser = typeof extendedUser.static;

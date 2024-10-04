import { t } from "elysia";
import { basicComment } from "./basic";
import { basicColumn } from "../column/basic";
import { basicUser } from "../user/basic";

// Extended
export const extendedComment = t.Composite([
    basicComment,
    t.Object({
        column: basicColumn,
        author: basicUser
    })
]);
export type SelectComment = typeof extendedComment.static;

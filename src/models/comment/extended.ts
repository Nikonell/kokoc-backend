import { t } from "elysia";
import { basicComment } from "./basic";
import { basicColumn } from "../column/basic";
import { basicUser } from "../user/basic";
import { basicMatch } from "../match/basic";

// Extended
export const extendedComment = t.Composite([
    basicComment,
    t.Object({
        column: t.Nullable(basicColumn),
        match: t.Nullable(basicMatch),
        author: basicUser
    })
]);
export type SelectComment = typeof extendedComment.static;

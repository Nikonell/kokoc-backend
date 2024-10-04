import { t } from "elysia";
import { basicComment } from "../comment/basic";
import { mappedColumn } from "./basic";

// Extended
export const extendedColumn = t.Composite([
    mappedColumn,
    t.Object({
        comments: t.Array(basicComment),
    })
]);
export type SelectColumn = typeof extendedColumn.static;

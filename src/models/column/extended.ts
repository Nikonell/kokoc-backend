import { t } from "elysia";
import { basicComment } from "../comment/basic";
import { basicColumn, mappedColumn } from "./basic";

// Extended
export const extendedColumn = t.Composite([
    basicColumn,
    t.Object({
        comments: t.Array(basicComment),
    })
]);
export type ExtendedColumn = typeof extendedColumn.static;

// Extended mapped
export const mappedExtendedColumn = t.Composite([
    mappedColumn,
    t.Object({
        comments: t.Array(basicComment),
    })
]);
export type MappedExtendedColumn = typeof mappedExtendedColumn.static;

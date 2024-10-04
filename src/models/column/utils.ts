import { t } from "elysia";
import { basicColumn } from "./basic";

// Insert
export const insertColumn = t.Omit(basicColumn, ["id", "createdAt", "likes", "dislikes"])
export type InsertColumn = typeof insertColumn.static;

// Filters
export const columnFilters = t.Object({
    page: t.Number({default: 1}),
    limit: t.Number({default: 20}),
    text: t.Optional(t.String({ minLength: 1, maxLength: 256 })),
});
export type ColumnFilters = typeof columnFilters.static;

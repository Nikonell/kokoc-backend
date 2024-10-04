import { t } from "elysia";
import { basicColumn, columnCategory } from "./basic";

// Insert
export const insertColumn = t.Omit(basicColumn, ["id", "createdAt", "likes", "dislikes"])
export type InsertColumn = typeof insertColumn.static;

// Filters
export const columnFilters = t.Object({
    page: t.Number({default: 0}),
    limit: t.Number({default: 10}),
    text: t.Optional(t.String({ minLength: 1, maxLength: 256 })),
    category: t.Optional(t.Array(columnCategory))
});
export type ColumnFilters = typeof columnFilters.static;

// Update
export const updateColumn = t.Mapped(
    t.KeyOf(t.Omit(basicColumn, ["id", "createdAt"])),
    K => t.Optional(t.Index(t.Omit(basicColumn, ["id", "createdAt"]), K))
);
export type UpdateColumn = typeof updateColumn.static;

// Mortal update
export const mortalUpdateColumn = t.Pick(
    updateColumn,
    ["likes", "dislikes"]
)
export type MortalUpdateColumn = typeof mortalUpdateColumn.static;

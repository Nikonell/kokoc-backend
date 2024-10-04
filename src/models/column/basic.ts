import { $Enums } from "@prisma/client";
import { t } from "elysia";

// Category
export const columnCategory = t.Enum($Enums.ColumnCategory);
export type ColumnCategory = typeof columnCategory.static;

// Basic
export const basicColumn = t.Object({
    id: t.Number({ minimum: 1 }),
    createdAt: t.Date(),
    category: columnCategory,
    title: t.String({ minLength: 1, maxLength: 256 }),
    content: t.String({ minLength: 1, maxLength: 8192 }),
    likes: t.Array(t.Number({ minimum: 1 })),
    dislikes: t.Array(t.Number({ minimum: 1 })),
})
export type BasicColumn = typeof basicColumn.static;

// Mapped
export const mappedColumn = t.Composite([
    t.Omit(basicColumn, ["likes", "dislikes"]),
    t.Object({
        likes: t.Number({ minimum: 0 }),
        dislikes: t.Number({ minimum: 0 }),
        liked: t.Boolean(),
        disliked: t.Boolean(),
    })
]);
export type MappedColumn = typeof mappedColumn.static;

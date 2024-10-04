import { t } from "elysia";

// Basic
export const basicComment = t.Object({
    id: t.Number({ minimum: 1 }),
    createdAt: t.Date(),
    content: t.String({ minLength: 1, maxLength: 2048 }),
    columnId: t.Number({ minimum: 1 }),
    authorId: t.Number({ minimum: 1 }),
});
export type BasicComment = typeof basicComment.static;

import { t } from "elysia";
import { basicComment } from "./basic";

// Insert
export const insertComment = t.Omit(basicComment, ["id", "createdAt"]);
export type InsertComment = typeof insertComment.static;

// Filters
export const commentFilters = t.Object({
    columnId: t.Optional(t.Number({minimum: 1})),
    authorId: t.Optional(t.Number({minimum: 1})),
});
export type CommentFilters = typeof commentFilters.static;

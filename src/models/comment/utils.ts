import { t } from "elysia";
import { basicComment } from "./basic";

// Insert
export const insertComment = t.Omit(basicComment, ["id", "createdAt", "authorId"]);
export type InsertComment = typeof insertComment.static;

// Filters
export const commentFilters = t.Object({
    page: t.Number({default: 1}),
    limit: t.Number({default: 10}),
    columnId: t.Optional(t.Number({minimum: 1})),
    authorId: t.Optional(t.Number({minimum: 1})),
});
export type CommentFilters = typeof commentFilters.static;

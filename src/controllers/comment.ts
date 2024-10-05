import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { CommentService } from "../services/comment";
import { commentFilters, insertComment } from "../models/comment/utils";
import { errorResponseType, paginatedResponse, paginatedResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { extendedComment } from "../models/comment/extended";

const commentController = new Elysia({ prefix: "/comments" })
    .use(authMiddleware)
    .get("", async ({ set, query }) => {
        const comments = await CommentService.getFiltered(query);
        const total = await CommentService.countFiltered(query);

        return paginatedResponse(set, comments, total, query.page, query.limit);
    }, {
        query: commentFilters,
        response: {
            200: paginatedResponseType(extendedComment),
        },
        detail: {
            summary: "Get all",
            description: "Get all comments",
            tags: ["Comments"]
        }
    })
    .get("/:id", async ({ set, params }) => {
        const comment = await CommentService.get(params.id);

        return successResponse(set, comment);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        response: {
            200: successResponseType(extendedComment),
            404: errorResponseType(404, "Comment not found")
        },
        detail: {
            summary: "Get by id",
            description: "Get a comment by id",
            tags: ["Comments"]
        }
    })
    .post("", async ({ set, body, auth }) => {
        const userId = await auth.id();

        const comment = await CommentService.create(body, userId);

        return successResponse(set, comment);
    }, {
        body: insertComment,
        response: {
            201: successResponseType(extendedComment),
            401: unauthorizedResponseType,
        },
        detail: {
            summary: "Create",
            description: "Create a comment",
            tags: ["Comments"]
        }
    })
    .delete("/:id", async ({ set, params, auth }) => {
        const userId = await auth.id();

        await CommentService.delete(params.id, userId);

        return successResponse(set, null, 204);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Comments can be deleted only by their authors or administrators"),
            404: errorResponseType(404, "Comment not found")
        },
        detail: {
            summary: "Delete",
            description: "Delete a comment",
            tags: ["Comments"]
        }
    });

export default commentController;

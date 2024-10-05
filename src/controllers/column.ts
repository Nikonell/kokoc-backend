import Elysia, { StatusMap, t } from "elysia";
import { ColumnService } from "../services/column";
import { columnFilters, insertColumn, updateColumn } from "../models/column/utils";
import { errorResponseType, paginatedResponse, paginatedResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { mappedExtendedColumn } from "../models/column/extended";
import { authMiddleware } from "../middleware/auth";
import { OperationError } from "../utils/errors";

const columnController = new Elysia({ prefix: "/columns" })
    .use(authMiddleware)
    .get("", async ({ set, query, auth }) => {
        const userId = await auth.loggedIn() ? await auth.id() : undefined;

        const columns = await ColumnService.getFiltered(query, userId);
        const total = await ColumnService.countFiltered(query);

        return paginatedResponse(set, columns, total, query.page, query.limit);
    }, {
        query: columnFilters,
        response: { 200: paginatedResponseType(mappedExtendedColumn) },
        detail: {
            summary: "Get all",
            description: "Get all columns",
            tags: ["Columns"]
        }
    })
    .get("/:id", async ({ set, params, auth }) => {
        const userId = await auth.loggedIn() ? await auth.id() : undefined;

        const column = await ColumnService.get(params.id, userId);

        return successResponse(set, column);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            200: successResponseType(mappedExtendedColumn),
            404: errorResponseType(404, "Column not found")
        },
        detail: {
            summary: "Get by id",
            description: "Get a column by id",
            tags: ["Columns"]
        }
    })
    .post("", async ({ set, body, auth }) => {
        const userId = await auth.id();

        const column = await ColumnService.create(body, userId);

        return successResponse(set, column, StatusMap.Created);
    }, {
        body: insertColumn,
        response: {
            201: successResponseType(mappedExtendedColumn),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can create columns")
        },
        detail: {
            summary: "Create",
            description: "Create a column",
            tags: ["Columns"]
        }
    })
    .patch("/:id", async ({ set, body, params, auth }) => {
        const userId = await auth.id();

        const column = await ColumnService.update(params.id, body, userId);

        return successResponse(set, column);
    }, {
        params: t.Object({ id: t.Number() }),
        body: updateColumn,
        response: {
            200: successResponseType(mappedExtendedColumn),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can update columns"),
            404: errorResponseType(404, "Column not found")
        },
        detail: {
            summary: "Update",
            description: "Update a column",
            tags: ["Columns"]
        }
    })
    .delete("/:id", async ({ set, auth, params }) => {
        const userId = await auth.id();

        await ColumnService.delete(params.id, userId);

        return successResponse(set, null, 204);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can delete columns"),
            404: errorResponseType(404, "Column not found")
        },
        detail: {
            summary: "Delete",
            description: "Delete a column",
            tags: ["Columns"]
        }
    })
    .post("/:id/like", async ({ set, params, auth }) => {
        const userId = await auth.id();

        const column = await ColumnService.getUnmapped(params.id);
        if (column.likes.includes(userId)) throw new OperationError("Already liked", 409);
        await ColumnService.updateMortal(params.id, { likes: [...column.likes, userId] });

        return successResponse(set, null);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            200: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            404: errorResponseType(404, "Column not found"),
            409: errorResponseType(409, "Already liked")
        },
        detail: {
            summary: "Like",
            description: "Like a column",
            tags: ["Columns"]
        }
    })
    .delete("/:id/like", async ({ set, params, auth }) => {
        const userId = await auth.id();

        const column = await ColumnService.getUnmapped(params.id);
        if (!column.likes.includes(userId)) throw new OperationError("Not liked", 409);
        await ColumnService.updateMortal(params.id, { likes: column.likes.filter(id => id !== userId) });

        return successResponse(set, null);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            200: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            404: errorResponseType(404, "Column not found"),
            409: errorResponseType(409, "Not liked")
        },
        detail: {
            summary: "Unlike",
            description: "Unlike a column",
            tags: ["Columns"]
        }
    })
    .post("/:id/dislike", async ({ set, params, auth }) => {
        const userId = await auth.id();

        const column = await ColumnService.getUnmapped(params.id);
        if (column.dislikes.includes(userId)) throw new OperationError("Already disliked", 409);
        await ColumnService.updateMortal(params.id, { dislikes: [...column.dislikes, userId] });

        return successResponse(set, null);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            200: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            404: errorResponseType(404, "Column not found"),
            409: errorResponseType(409, "Already disliked")
        },
        detail: {
            summary: "Dislike",
            description: "Dislike a column",
            tags: ["Columns"]
        }
    })
    .delete("/:id/dislike", async ({ set, params, auth }) => {
        const userId = await auth.id();

        const column = await ColumnService.getUnmapped(params.id);
        if (!column.dislikes.includes(userId)) throw new OperationError("Not disliked", 409);
        await ColumnService.updateMortal(params.id, { dislikes: column.dislikes.filter(id => id !== userId) });

        return successResponse(set, null);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            200: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            404: errorResponseType(404, "Column not found"),
            409: errorResponseType(409, "Not disliked")
        },
        detail: {
            summary: "Undislike",
            description: "Undislike a column",
            tags: ["Columns"]
        }
    });

export default columnController;

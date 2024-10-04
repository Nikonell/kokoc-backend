import Elysia, { StatusMap, t } from "elysia";
import { ColumnService } from "../services/columns";
import { columnFilters, insertColumn } from "../models/column/utils";
import { errorResponseType, paginatedResponse, paginatedResponseType, successResponse, successResponseType } from "../utils/responses";
import { extendedColumn } from "../models/column/extended";
import { authMiddleware } from "../middleware/auth";

const columnController = new Elysia({ prefix: "/columns" })
    .use(authMiddleware)
    .get("", async ({ set, query, auth }) => {
        const userId = await auth.loggedIn() ? await auth.id() : undefined;

        const columns = await ColumnService.get_filtered(query, userId);
        const total = await ColumnService.count_filtered(query);
        const hasNext = total - (query.page * query.limit) > 0;

        return paginatedResponse(set, columns, total, query.page, query.limit, hasNext);
    }, {
        query: columnFilters,
        response: {
            200: paginatedResponseType(extendedColumn),
        },
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
        params: t.Object({
            id: t.Number()
        }),
        response: {
            200: successResponseType(extendedColumn),
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
            201: successResponseType(extendedColumn),
            401: errorResponseType(401, "Unauthorized"),
            403: errorResponseType(403, "Only administrators can create columns")
        },
        detail: {
            summary: "Create",
            description: "Create a column",
            tags: ["Columns"]
        }
    })
    .delete("/:id", async ({ set, auth, params }) => {
        const userId = await auth.id();

        await ColumnService.delete(params.id, userId);

        return successResponse(set, null);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        response:{
            200: successResponseType(t.Null()),
            401: errorResponseType(401, "Unauthorized"),
            403: errorResponseType(403, "Only administrators can delete columns"),
            404: errorResponseType(404, "Column not found")
        },
        detail: {
            summary: "Delete",
            description: "Delete a column",
            tags: ["Columns"]
        }
    });

export default columnController;

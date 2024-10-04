import Elysia, { t } from "elysia";
import { ColumnService } from "../services/columns";
import { columnFilters } from "../models/column/utils";
import { errorResponseType, paginatedResponse, paginatedResponseType, successResponse, successResponseType } from "../utils/responses";
import { extendedColumn } from "../models/column/extended";
import { authMiddleware } from "../middleware/auth";

const columnController = new Elysia({ prefix: "/columns" })
    .use(authMiddleware)
    .get("/", async ({ set, query, auth }) => {
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
    });

export default columnController;

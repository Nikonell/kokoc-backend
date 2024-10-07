import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { MatchService } from "../services/match";
import { errorResponseType, paginatedResponse, paginatedResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { extendedMatch } from "../models/match/extended";
import { insertMatch, matchFilters, updateMatch } from "../models/match/utils";

const matchController = new Elysia({ prefix: "/matches" })
    .use(authMiddleware)
    .get("", async ({ set, query }) => {
        const matches = await MatchService.getFiltered(query);
        const total = await MatchService.countFiltered(query);

        return paginatedResponse(set, matches, total, query.page, query.limit);
    }, {
        query: matchFilters,
        response: { 200: paginatedResponseType(extendedMatch) },
        detail: {
            summary: "Get all",
            description: "Get all matches",
            tags: ["Matches"]
        }
    })
    .get("/:id", async ({ set, params }) => {
        const match = await MatchService.get(params.id);

        return successResponse(set, match);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            200: successResponseType(extendedMatch),
            404: errorResponseType(404, "Match not found")
        },
        detail: {
            summary: "Get by id",
            description: "Get a match by id",
            tags: ["Matches"]
        }
    })
    .post("", async ({ set, body, auth }) => {
        const userId = await auth.id();

        const match = await MatchService.create(body, userId);

        return successResponse(set, match, 201);
    }, {
        body: insertMatch,
        response: {
            201: successResponseType(extendedMatch),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can create matches")
        },
        detail: {
            summary: "Create",
            description: "Create a match",
            tags: ["Matches"]
        }
    })
    .patch("/:id", async ({ set, body, params, auth }) => {
        const userId = await auth.id();

        const match = await MatchService.update(params.id, body, userId);

        return successResponse(set, match);
    }, {
        params: t.Object({ id: t.Number() }),
        body: updateMatch,
        response: {
            200: successResponseType(extendedMatch),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can update matches"),
            404: errorResponseType(404, "Match not found")
        },
        detail: {
            summary: "Update",
            description: "Update a match",
            tags: ["Matches"]
        }
    })
    .delete("/:id", async ({ set, auth, params }) => {
        const userId = await auth.id();

        await MatchService.delete(params.id, userId);

        return successResponse(set, null, 204);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can delete matches"),
            404: errorResponseType(404, "Match not found")
        },
        detail: {
            summary: "Delete",
            description: "Delete a match",
            tags: ["Matches"]
        }
    });

export default matchController;

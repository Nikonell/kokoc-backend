import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { SecondTeamCompositionService } from "../services/secondTeamComposition";
import { errorResponseType, paginatedResponse, paginatedResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { extendedSecondTeamComposition } from "../models/secondTeamComposition/extended";
import { insertSecondTeamComposition, secondTeamCompositionFilters, updateSecondTeamComposition } from "../models/secondTeamComposition/utils";

const secondTeamCompositionController = new Elysia({ prefix: "/team/second/compositions" })
    .use(authMiddleware)
    .get("", async ({ set, query }) => {
        const compositions = await SecondTeamCompositionService.getFiltered(query);
        const total = await SecondTeamCompositionService.countFiltered(query);

        return paginatedResponse(set, compositions, total, query.page, query.limit);
    }, {
        query: secondTeamCompositionFilters,
        response: { 200: paginatedResponseType(extendedSecondTeamComposition) },
        detail: {
            summary: "Get all",
            description: "Get all second team compositions",
            tags: ["Second Team Compositions"]
        }
    })
    .get("/:id", async ({ set, params }) => {
        const composition = await SecondTeamCompositionService.get(params.id);

        return successResponse(set, composition);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            200: successResponseType(extendedSecondTeamComposition),
            404: errorResponseType(404, "Second team composition not found")
        },
        detail: {
            summary: "Get by id",
            description: "Get a second team composition by id",
            tags: ["Second Team Compositions"]
        }
    })
    .post("", async ({ set, body, auth }) => {
        const userId = await auth.id();

        const composition = await SecondTeamCompositionService.create(body, userId);

        return successResponse(set, composition, 201);
    }, {
        body: insertSecondTeamComposition,
        response: {
            201: successResponseType(extendedSecondTeamComposition),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can create second team compositions")
        },
        detail: {
            summary: "Create",
            description: "Create a second team composition",
            tags: ["Second Team Compositions"]
        }
    })
    .patch("/:id", async ({ set, body, params, auth }) => {
        const userId = await auth.id();

        const composition = await SecondTeamCompositionService.update(params.id, body, userId);

        return successResponse(set, composition);
    }, {
        params: t.Object({ id: t.Number() }),
        body: updateSecondTeamComposition,
        response: {
            200: successResponseType(extendedSecondTeamComposition),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can update second team compositions"),
            404: errorResponseType(404, "Second team composition not found")
        },
        detail: {
            summary: "Update",
            description: "Update a second team composition",
            tags: ["Second Team Compositions"]
        }
    })
    .delete("/:id", async ({ set, auth, params }) => {
        const userId = await auth.id();

        await SecondTeamCompositionService.delete(params.id, userId);

        return successResponse(set, null, 204);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can delete second team compositions"),
            404: errorResponseType(404, "Second team composition not found")
        },
        detail: {
            summary: "Delete",
            description: "Delete a second team composition",
            tags: ["Second Team Compositions"]
        }
    });

export default secondTeamCompositionController;

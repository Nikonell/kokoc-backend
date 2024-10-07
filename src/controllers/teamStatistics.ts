import Elysia from "elysia";
import { errorResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { teamStatistics } from "../models/teamStatistics/basic";
import { TeamStatisticsService } from "../services/teamStatistics";
import { updateTeamStatistics } from "../models/teamStatistics/utils";
import { UserService } from "../services/user";
import { authMiddleware } from "../middleware/auth";
import { OperationError } from "../utils/errors";

const teamStatisticsController = new Elysia({ prefix: "/team/stats" })
    .use(authMiddleware)
    .get("/", async ({ set }) => {
        const stats = await TeamStatisticsService.get();
        return successResponse(set, stats);
    }, {
        response: {
            200: successResponseType(teamStatistics),
        },
        detail: {
            summary: "Get",
            description: "Get team statistics",
            tags: ["Team Statistics"]
        }
    })
    .patch("/", async ({ set, body, auth }) => {
        const user = await UserService.getSlim(await auth.id());
        if (!user.isAdmin) throw new OperationError("Only admins can update team statistics", 403);

        const stats = await TeamStatisticsService.update(body);
        return successResponse(set, stats);
    }, {
        body: updateTeamStatistics,
        response: {
            200: successResponseType(teamStatistics),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only admins can update team statistics")
        },
        detail: {
            summary: "Update",
            description: "Update team statistics",
            tags: ["Team Statistics"]
        }
    });

export default teamStatisticsController;

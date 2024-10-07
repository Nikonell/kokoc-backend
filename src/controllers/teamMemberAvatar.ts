import Elysia, { StatusMap, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { errorResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { getUpload, saveUpload } from "../utils/uploads";
import { UserService } from "../services/user";
import { OperationError } from "../utils/errors";

const teamMemberAvatarController = new Elysia({ prefix: "/team/members/avatars" })
    .use(authMiddleware)
    .get("/:id", async ({ params }) => {
        return await getUpload("teamMemberAvatars", `${params.id}`, "default.jpg");
    }, {
        params: t.Object({ id: t.Number() }),
        response: { 404: errorResponseType(404, "File not found") },
        detail: {
            summary: "Get avatar",
            description: "Get a team member avatar by id",
            tags: ["Team Members"]
        }
    })
    .post("/:id", async ({ set, params, body, auth }) => {
        const userId = await auth.id();

        const user = await UserService.getSlim(userId);
        if (!user?.isAdmin) throw new OperationError("Only administrators can upload team member avatars", StatusMap.Forbidden);

        await saveUpload("teamMemberAvatars", String(params.id), body.file);
        return successResponse(set, null, 204);
    }, {
        params: t.Object({ id: t.Number() }),
        body: t.Object({
            file: t.File({
                maxSize: "5m",
                type: ["image/avif", "image/jpeg", "image/png", "image/webp", "image/svg", "image/gif"]
            }),
        }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can upload team member avatars"),
            404: errorResponseType(404, "Team member not found")
        },
        detail: {
            summary: "Upload avatar",
            description: "Upload a team member avatar",
            tags: ["Team Members"]
        }
    });

export default teamMemberAvatarController;

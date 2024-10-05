import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { errorResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { getUpload, saveUpload } from "../utils/uploads";

const userAvatarController = new Elysia({ prefix: "/users/avatars" })
    .use(authMiddleware)
    .get("/:id", async ({ params }) => {
        return await getUpload("avatars", `${params.id}`, "default.jpg");
    }, {
        params: t.Object({ id: t.Number() }),
        response: { 404: errorResponseType(404, "File not found") },
        detail: {
            summary: "Get avatar",
            description: "Get a user avatar by id",
            tags: ["Users"]
        }
    })
    .post("", async ({ set, body, auth }) => {
        const id = await auth.id();
        await saveUpload("avatars", String(id), body.file);
        return successResponse(set, null);
    }, {
        body: t.Object({
            file: t.File({
                maxSize: "2m",
                type: ["image/avif", "image/jpeg", "image/png", "image/webp", "image/svg", "image/gif"]
            })
        }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType
        },
        detail: {
            summary: "Upload avatar",
            description: "Upload a user avatar for the authenticated user",
            tags: ["Users"]
        }
    });

export default userAvatarController;

import Elysia, { StatusMap, t } from "elysia";
import { getUpload, saveUpload } from "../utils/uploads";
import { authMiddleware } from "../middleware/auth";
import { errorResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { UserService } from "../services/user";
import { OperationError } from "../utils/errors";

const columnBannerController = new Elysia({ prefix: "/columns/banners" })
    .use(authMiddleware)
    .get("/:id", async ({ params }) => {
        return await getUpload("banners", `${params.id}`);
    }, {
        params: t.Object({ id: t.Number() }),
        response: { 404: errorResponseType(404, "File not found") },
        detail: {
            summary: "Get banner",
            description: "Get a column banner by id",
            tags: ["Columns"]
        }
    })
    .post("/:id", async ({ set, params, body, auth }) => {
        const userId = await auth.id();

        const user = await UserService.getSlim(userId);
        if (!user?.isAdmin) throw new OperationError("Only administrators can upload column banners", StatusMap.Forbidden);

        await saveUpload("columnBanners", String(params.id), body.file);
        return successResponse(set, null);
    }, {
        params: t.Object({ id: t.Number() }),
        body: t.Object({
            file: t.File({
                maxSize: "5m",
                type: ["image/avif", "image/jpeg", "image/png", "image/webp", "image/svg", "image/gif"]
            })
        }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can upload column banners")
        },
        detail: {
            summary: "Upload banner",
            description: "Upload a column banner",
            tags: ["Columns"]
        }
    });

export default columnBannerController;

import Elysia, { StatusMap, t } from "elysia";
import { getUpload, saveUpload } from "../utils/uploads";
import { errorResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { UserService } from "../services/user";
import { OperationError } from "../utils/errors";
import { authMiddleware } from "../middleware/auth";

const productImageController = new Elysia({ prefix: "/products/images" })
    .use(authMiddleware)
    .get("/:id", async ({ params }) => {
        return await getUpload("productImages", `${params.id}`);
    }, {
        params: t.Object({ id: t.Number() }),
        response: { 404: errorResponseType(404, "File not found") },
        detail: {
            summary: "Get image",
            description: "Get a product image by id",
            tags: ["Products"]
        }
    })
    .post("/:id", async ({ set, params, body, auth }) => {
        const userId = await auth.id();

        const user = await UserService.getSlim(userId);
        if (!user?.isAdmin) throw new OperationError("Only administrators can upload product images", StatusMap.Forbidden);

        await saveUpload("productImages", String(params.id), body.file);
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
            403: errorResponseType(403, "Only administrators can upload product images")
        },
        detail: {
            summary: "Upload image",
            description: "Upload a product image",
            tags: ["Products"]
        }
    });

export default productImageController;

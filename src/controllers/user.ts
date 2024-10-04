import Elysia from "elysia";
import { authMiddleware } from "../middleware/auth";
import { UserService } from "../services/user";
import { errorResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { extendedUser } from "../models/user/extended";

const userController = new Elysia({ prefix: "/users" })
    .use(authMiddleware)
    .get("/me", async ({ set, auth }) => {
        const id = await auth.id();
        const user = await UserService.get(id);
        return successResponse(set, user);
    }, {
        response: {
            200: successResponseType(extendedUser),
            401: unauthorizedResponseType,
            404: errorResponseType(404, "User not found")
        },
        detail: {
            summary: "Get me",
            description: "Get current authenticated user",
            tags: ["Users"]
        }
    });

export default userController;

import Elysia from "elysia";
import { authMiddleware } from "../middleware/auth";
import { errorResponseType, successResponse, successResponseType } from "../utils/responses";
import { AuthService } from "../services/auth";
import { authResponse, loginUserRequest, registerUserRequest } from "../models/auth/utils";

const authController = new Elysia({ prefix: "/auth" })
    .use(authMiddleware)
    .post("/login", async ({ set, body, auth }) => {
        const id = await AuthService.loginByCredentials(body);
        const token = await auth.authorize(id);

        return successResponse(set, {token}, 200);
    }, {
        body: loginUserRequest,
        response: {
            200: successResponseType(authResponse),
            404: errorResponseType(404, "Invalid credentials"),
        },
        detail: {
            summary: "Login",
            description: "Login with email and password",
            tags: ["Auth"],
        }
    })
    .post("/register", async ({ set, body, auth }) => {
        const id = await AuthService.register(body);
        const token = await auth.authorize(id);

        return successResponse(set, {token}, 200);
    }, {
        body: registerUserRequest,
        response: {
            200: successResponseType(authResponse),
            409: errorResponseType(409, "User with this email already exists"),
        },
        detail: {
            summary: "Register",
            description: "Register new user",
            tags: ["Auth"]
        }
    });

export default authController;

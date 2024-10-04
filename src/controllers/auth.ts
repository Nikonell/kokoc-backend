import Elysia from "elysia";
import { authMiddleware } from "../middleware/auth";
import { errorResponseType, successResponse, successResponseType } from "../utils/responses";
import { AuthService } from "../services/auth";
import { authResponse, loginUserRequest, registerUserRequest } from "../models/auth/utils";

const authController = new Elysia({ prefix: "/auth" })
    .use(authMiddleware)
    .post("/login", async ({set, body, auth}) => {
        const id = await AuthService.loginByCredentials(body);
        await auth.authorize(id);

        return successResponse(set, null);
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
        await auth.authorize(id);

        return successResponse(set, null);
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
    })
    .get("/logout", async ({ set, auth }) => {
        await auth.logout();

        return successResponse(set, null);
    }, {
        response: {
            200: successResponseType(authResponse)
        },
        detail: {
            summary: "Logout",
            description: "Logout current user",
            tags: ["Auth"]
        }
    });

export default authController;

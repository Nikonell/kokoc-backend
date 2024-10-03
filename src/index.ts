import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { Logestic } from "logestic";
import { authMiddleware } from "./middleware/auth";
import { errorResponse, validationErrorResponse } from "./utils/responses";
import authController from "./controllers/auth";
import { errorsDefinition } from "./utils/errors";

const logger = Logestic.preset("fancy");

const scalar = swagger({
    path: "/docs",
    documentation: {
        info: {
            title: "Kokoc Documentation",
            description: "API documentation for Kokoc",
            version: "1.0.0",
        },
        tags: [
            {name: "Auth", description: "Authentication routes"}
        ]
    },
    scalarConfig: {
        spec: {
            url: "/api/docs/json",
        },
    },
});

const app = new Elysia({ prefix: "/api" })
    .use(scalar)
    .use(logger)
    .use(errorsDefinition)
    .use(authMiddleware)
    .onError(({ code, error, set }) => {
        switch (code) {
            case "INTERNAL_SERVER_ERROR":
            case "INVALID_COOKIE_SIGNATURE":
            case "PARSE":
            case "UNAUTHORIZED":
            case "NOT_FOUND":
            case "OPERATION":
                return errorResponse(set, error.message, error.status);
            case "VALIDATION":
                return validationErrorResponse(set, JSON.parse(error.message), error.status);
            default:
                return errorResponse(set, error.message, 500);
        }
    })
    .use(authController)
    .listen(3000, ({ hostname, port }) => {
        console.log(`🦊 Elysia is running at ${hostname}:${port}`);
    });

import {Elysia} from "elysia";
import jwt from "@elysiajs/jwt";
import { errorsDefinition, UnauthorizedError } from "../utils/errors";

export const authMiddleware = new Elysia()
    .use(jwt({
        name: "jwt",
        secret: String(process.env.JWT_SECRET),
    }))
    .use(errorsDefinition)
    .derive({as: "scoped"}, ({jwt, headers}) => {
        const token = headers["authorization"]?.split("Bearer ")[1] ?? "";

        return {
            auth: {
                async authorize(id: number): Promise<string> {
                    return await jwt.sign({ id });
                },
                async loggedIn() {
                    return !!await jwt.verify(token);
                },
                async id() {
                    const session = await jwt.verify(token);
                    if (!session) throw new UnauthorizedError();
                    return +session.id;
                }
            }
        }
    });

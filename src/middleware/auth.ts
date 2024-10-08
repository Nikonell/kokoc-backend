import {Elysia} from "elysia";
import jwt from "@elysiajs/jwt";
import { errorsDefinition, UnauthorizedError } from "../utils/errors";

export const authMiddleware = new Elysia()
    .use(jwt({
        name: "jwt",
        secret: String(process.env.JWT_SECRET),
    }))
    .use(errorsDefinition)
    .derive({as: "scoped"}, ({cookie: {auth}, jwt, headers}) => {
        const token = auth.value || (headers["authorization"]?.split("Bearer ")[1] ?? "");

        return {
            auth: {
                async authorize(id: number) {
                    auth.set({
                        value: await jwt.sign({id}),
                        maxAge: 60 * 60 * 24 * 30,
                        httpOnly: false
                    });
                },
                async logout() {
                    auth.set({
                        value: "",
                        maxAge: 0,
                        httpOnly: false
                    });
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

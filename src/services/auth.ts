import prisma from "../utils/prisma";
import { InternalServerError, NotFoundError, ParseError, StatusMap } from "elysia";
import { createHash } from 'crypto';
import { OperationError } from "../utils/errors";
import { LoginUserRequest, RegisterUserRequest } from "../models/auth/utils";

export abstract class AuthService {
    static async loginByCredentials(data: LoginUserRequest): Promise<number> {
        const hash = createHash("sha256").update(data.password).digest("hex");
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
                passwordHash: hash
            },
            select: {
                id: true
            }
        });

        if (!user) throw new NotFoundError("Invalid credentials");

        return user.id;
    }

    static async register(data: RegisterUserRequest): Promise<number> {
        if (await prisma.user.findUnique({where: {email: data.email}})) {
            throw new OperationError("User with this email already exists", StatusMap.Conflict);
        }

        const hash = createHash("sha256").update(data.password).digest("hex");
        const user = await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                passwordHash: hash
            }
        });

        return user.id;
    }
}

import { NotFoundError } from "elysia";
import prisma from "../utils/prisma";
import { BasicUser } from "../models/user/basic";

export abstract class UserService {
    static async get(id: number): Promise<SelectUser> {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                comments: true,
            }
        });

        if (!user) throw new NotFoundError("User not found");
        return user;
    }

    static async get_slim(id: number): Promise<BasicUser> {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if (!user) throw new NotFoundError("User not found");
        return user;
    }
}

import { NotFoundError } from "elysia";
import prisma from "../utils/prisma";
import { BasicUser } from "../models/user/basic";
import { SelectUser } from "../models/user/extended";
import { CartService } from "./cart";

export abstract class UserService {
    static async get(id: number): Promise<SelectUser> {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                comments: true
            }
        });

        if (!user) throw new NotFoundError("User not found");

        const cart = await CartService.get(id);

        return {...user, cart};
    }

    static async getSlim(id: number): Promise<BasicUser> {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if (!user) throw new NotFoundError("User not found");
        return user;
    }
}

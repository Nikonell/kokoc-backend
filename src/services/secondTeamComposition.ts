import { NotFoundError } from "elysia";
import prisma from "../utils/prisma";
import { ExtendedSecondTeamComposition } from "../models/secondTeamComposition/extended";
import { InsertSecondTeamComposition, SecondTeamCompositionFilters, UpdateSecondTeamComposition } from "../models/secondTeamComposition/utils";
import { UserService } from "./user";
import { OperationError } from "../utils/errors";

export abstract class SecondTeamCompositionService {
    static async get(id: number): Promise<ExtendedSecondTeamComposition> {
        const composition = await prisma.secondTeamComposition.findUnique({
            where: { id },
            include: { match: true }
        });

        if (!composition) throw new NotFoundError("Second team composition not found");
        return composition;
    }

    static async getFiltered(filters: SecondTeamCompositionFilters): Promise<ExtendedSecondTeamComposition[]> {
        const { page, limit, matchId } = filters;

        const compositions = await prisma.secondTeamComposition.findMany({
            where: { matchId },
            skip: page * limit,
            take: limit,
            orderBy: { id: "asc" },
            include: { match: true }
        });

        return compositions;
    }

    static async countFiltered(filters: SecondTeamCompositionFilters): Promise<number> {
        const { matchId } = filters;

        return await prisma.secondTeamComposition.count({
            where: { matchId }
        });
    }

    static async create(composition: InsertSecondTeamComposition, userId: number): Promise<ExtendedSecondTeamComposition> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can create second team compositions", 403);

        const newComposition = await prisma.secondTeamComposition.create({
            data: composition,
            include: { match: true }
        });

        return newComposition;
    }

    static async update(id: number, composition: UpdateSecondTeamComposition, userId: number): Promise<ExtendedSecondTeamComposition> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can update second team compositions", 403);

        const updatedComposition = await prisma.secondTeamComposition.update({
            where: { id },
            data: composition,
            include: { match: true }
        });

        return updatedComposition;
    }

    static async delete(id: number, userId: number): Promise<void> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can delete second team compositions", 403);

        await prisma.secondTeamComposition.delete({ where: { id } });
    }
}

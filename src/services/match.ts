import { NotFoundError } from "elysia";
import prisma from "../utils/prisma";
import { ExtendedMatch } from "../models/match/extended";
import { InsertMatch, MatchFilters, UpdateMatch } from "../models/match/utils";
import { UserService } from "./user";
import { OperationError } from "../utils/errors";

export abstract class MatchService {
    static async get(id: number, userId?: number): Promise<ExtendedMatch> {
        const match = await prisma.match.findUnique({
            where: { id },
            include: {
                kokocComposition: true,
                secondTeamComposition: true,
                comments: true,
            }
        });

        if (!match) throw new NotFoundError("Match not found");

        if (userId) {
            const user = await UserService.getSlim(userId);
            if (!user.viewedMatches.includes(match.id)) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { viewedMatches: { push: match.id } }
                });
            }
        }

        return match;
    }

    static async getFiltered(filters: MatchFilters): Promise<ExtendedMatch[]> {
        const { page, limit, startDate, endDate, result, name } = filters;

        const whereClause = {
            AND: [
                startDate ? { dateTime: { gte: startDate } } : {},
                endDate ? { dateTime: { lte: endDate } } : {},
                result?.length ? { result: { in: result } } : {},
                name ? {
                    OR: [
                        { matchName: { contains: name, mode: 'insensitive' as const } },
                        { secondTeamName: { contains: name, mode: 'insensitive' as const } }
                    ]
                } : {}
            ]
        };

        const matches = await prisma.match.findMany({
            where: whereClause,
            skip: page * limit,
            take: limit,
            orderBy: { dateTime: "desc" },
            include: {
                kokocComposition: true,
                secondTeamComposition: true,
                comments: true,
            }
        });

        return matches;
    }

    static async countFiltered(filters: MatchFilters): Promise<number> {
        const { startDate, endDate, result, name } = filters;

        const whereClause = {
            AND: [
                startDate ? { dateTime: { gte: startDate } } : {},
                endDate ? { dateTime: { lte: endDate } } : {},
                result?.length ? { result: { in: result } } : {},
                name ? {
                    OR: [
                        { matchName: { contains: name, mode: 'insensitive' as const } },
                        { secondTeamName: { contains: name, mode: 'insensitive' as const } }
                    ]
                } : {}
            ]
        };

        return await prisma.match.count({ where: whereClause });
    }

    static async create(match: InsertMatch, userId: number): Promise<ExtendedMatch> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can create matches", 403);

        const newMatch = await prisma.match.create({
            data: match,
            include: {
                kokocComposition: true,
                secondTeamComposition: true,
                comments: true,
            }
        });

        return newMatch;
    }

    static async update(id: number, match: UpdateMatch, userId: number): Promise<ExtendedMatch> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can update matches", 403);

        const updatedMatch = await prisma.match.update({
            where: { id },
            data: match,
            include: {
                kokocComposition: true,
                secondTeamComposition: true,
                comments: true,
            }
        });

        return updatedMatch;
    }

    static async delete(id: number, userId: number): Promise<void> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can delete matches", 403);

        await prisma.match.delete({ where: { id } });
    }
}

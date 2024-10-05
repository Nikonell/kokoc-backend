import { NotFoundError } from "elysia";
import prisma from "../utils/prisma";
import { UserService } from "./user";
import { OperationError } from "../utils/errors";
import { BasicColumn, MappedColumn } from "../models/column/basic";
import { ColumnFilters, InsertColumn, MortalUpdateColumn, UpdateColumn } from "../models/column/utils";
import { ExtendedColumn, MappedExtendedColumn } from "../models/column/extended";

export abstract class ColumnService {
    static async get(id: number, userId?: number): Promise<MappedExtendedColumn> {
        const column = await prisma.column.findUnique({
            where: { id },
            include: { comments: true }
        });

        if (!column) throw new NotFoundError("Column not found");

        return this.mapExtendedColumn(column, userId);
    }

    static async get_slim(id: number, userId?: number): Promise<MappedColumn> {
        const column = await this.get_unmapped(id);
        return this.mapBasicColumn(column, userId);
    }

    static async get_unmapped(id: number): Promise<BasicColumn> {
        const column = await prisma.column.findUnique({
            where: { id }
        });

        if (!column) throw new NotFoundError("Column not found");
        return column;
    }

    static async get_filtered(filters: ColumnFilters, userId?: number): Promise<MappedExtendedColumn[]> {
        const { page, limit, text, category } = filters;

        const whereClause = {
            AND: [
                text ? {
                    OR: [
                        { title: { contains: text, mode: 'insensitive' as const } },
                        { content: { contains: text, mode: 'insensitive' as const } },
                        { summary: { contains: text, mode: 'insensitive' as const } }
                    ]
                } : {},
                category?.length ? { category: { in: category } } : {}
            ]
        };

        const columns = await prisma.column.findMany({
            skip: page * limit,
            take: limit,
            where: whereClause,
            orderBy: { createdAt: "desc" },
            include: {
                comments: {
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        return columns.map(column => this.mapExtendedColumn(column, userId));
    }

    static async count_filtered(filters: ColumnFilters): Promise<number> {
        const { text, category } = filters;

        const whereClause = {
            AND: [
                text ? {
                    OR: [
                        { title: { contains: text, mode: 'insensitive' as const } },
                        { content: { contains: text, mode: 'insensitive' as const } },
                        { summary: { contains: text, mode: 'insensitive' as const } }
                    ]
                } : {},
                category?.length ? { category: { in: category } } : {}
            ]
        };

        return await prisma.column.count({ where: whereClause });
    }

    static async create(column: InsertColumn, userId: number): Promise<MappedExtendedColumn> {
        const user = await UserService.get_slim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can create columns", 403);

        const newColumn = await prisma.column.create({
            data: column,
            include: { comments: true }
        });

        return this.mapExtendedColumn(newColumn);
    }

    static async update(id: number, column: UpdateColumn, userId: number): Promise<MappedExtendedColumn> {
        const user = await UserService.get_slim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can update columns", 403);

        const updatedColumn = await prisma.column.update({
            where: { id },
            data: column,
            include: { comments: true }
        });

        return this.mapExtendedColumn(updatedColumn);
    }

    static async update_mortal(id: number, column: MortalUpdateColumn): Promise<MappedExtendedColumn> {
        const updatedColumn = await prisma.column.update({
            where: { id },
            data: column,
            include: { comments: true }
        });

        return this.mapExtendedColumn(updatedColumn);
    }

    static async delete(id: number, userId: number) {
        const user = await UserService.get_slim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can delete columns", 403);

        const column = await prisma.column.delete({ where: { id } });
        if (!column.id) throw new NotFoundError("Column not found");
    }

    private static mapBasicColumn(column: BasicColumn, userId?: number): MappedColumn {
        return {
            ...column,
            likes: column.likes.length,
            dislikes: column.dislikes.length,
            liked: userId ? column.likes.includes(userId) : false,
            disliked: userId ? column.dislikes.includes(userId) : false,
        };
    }

    private static mapExtendedColumn(column: ExtendedColumn, userId?: number): MappedExtendedColumn {
        return {
            ...column,
            likes: column.likes.length,
            dislikes: column.dislikes.length,
            liked: userId ? column.likes.includes(userId) : false,
            disliked: userId ? column.dislikes.includes(userId) : false,
        };
    }
}

import { NotFoundError } from "elysia";
import prisma from "../utils/prisma";
import { UserService } from "./user";
import { OperationError } from "../utils/errors";
import { BasicColumn, columnCategory, MappedColumn } from "../models/column/basic";
import { ColumnFilters, InsertColumn, MortalUpdateColumn, UpdateColumn } from "../models/column/utils";
import { SelectColumn } from "../models/column/extended";

export abstract class ColumnService {
    static async get(id: number, userId?: number): Promise<SelectColumn> {
        const column = await prisma.column.findUnique({
            where: { id },
            include: { comments: true }
        });

        if (!column) throw new NotFoundError("Column not found");

        return this.mapColumn(column, userId);
    }

    static async get_slim(id: number, userId?: number): Promise<MappedColumn> {
        const column = await this.get_unmapped(id);
        return this.mapColumn(column, userId);
    }

    static async get_unmapped(id: number): Promise<BasicColumn> {
        const column = await prisma.column.findUnique({
            where: { id }
        });

        if (!column) throw new NotFoundError("Column not found");
        return column;
    }

    static async get_filtered(filters: ColumnFilters, userId?: number): Promise<SelectColumn[]> {
        const { page, limit, text, category } = filters;

        const whereClause = this.buildWhereClause(text, category);

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

        return columns.map(column => this.mapColumn(column, userId));
    }

    static async count_filtered(filters: ColumnFilters): Promise<number> {
        const { text, category } = filters;

        const whereClause = this.buildWhereClause(text, category);

        return await prisma.column.count({ where: whereClause });
    }

    private static buildWhereClause(text?: string, category?: string[]): any {
        return {
            AND: [
                text ? {
                    OR: [
                        { title: { contains: text, mode: 'insensitive' } },
                        { content: { contains: text, mode: 'insensitive' } },
                        { summary: { contains: text, mode: 'insensitive' } }
                    ]
                } : {},
                category?.length ? { category: { in: category } } : {}
            ]
        };
    }

    static async create(column: InsertColumn, userId: number): Promise<SelectColumn> {
        const user = await UserService.get_slim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can create columns", 403);

        const newColumn = await prisma.column.create({
            data: column,
            include: { comments: true }
        });

        return this.mapColumn(newColumn);
    }

    static async update(id: number, column: UpdateColumn, userId: number): Promise<SelectColumn> {
        const user = await UserService.get_slim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can update columns", 403);

        const updatedColumn = await prisma.column.update({
            where: { id },
            data: column,
            include: { comments: true }
        });

        return this.mapColumn(updatedColumn);
    }

    static async update_mortal(id: number, column: MortalUpdateColumn): Promise<SelectColumn> {
        const updatedColumn = await prisma.column.update({
            where: { id },
            data: column,
            include: { comments: true }
        });

        return this.mapColumn(updatedColumn);
    }

    static async delete(id: number, userId: number) {
        const user = await UserService.get_slim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can delete columns", 403);

        const column = await prisma.column.delete({ where: { id } });
        if (!column.id) throw new NotFoundError("Column not found");
    }

    private static mapColumn(column: any, userId?: number): SelectColumn {
        return {
            ...column,
            likes: column.likes.length,
            dislikes: column.dislikes.length,
            liked: userId ? column.likes.includes(userId) : false,
            disliked: userId ? column.dislikes.includes(userId) : false,
        };
    }
}

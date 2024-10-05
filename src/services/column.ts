import { NotFoundError } from "elysia";
import prisma from "../utils/prisma";
import { UserService } from "./user";
import { OperationError } from "../utils/errors";
import { BasicColumn, MappedColumn } from "../models/column/basic";
import { ColumnFilters, InsertColumn, MortalUpdateColumn, UpdateColumn } from "../models/column/utils";
import { ExtendedColumn, MappedExtendedColumn } from "../models/column/extended";
import { uploadExists } from "../utils/uploads";

export abstract class ColumnService {
    static async get(id: number, userId?: number): Promise<MappedExtendedColumn> {
        const column = await prisma.column.findUnique({
            where: { id },
            include: { comments: true }
        });

        if (!column) throw new NotFoundError("Column not found");

        return await this.mapExtendedColumn(column, userId);
    }

    static async get_slim(id: number, userId?: number): Promise<MappedColumn> {
        const column = await this.getUnmapped(id);
        return await this.mapBasicColumn(column, userId);
    }

    static async getUnmapped(id: number): Promise<BasicColumn> {
        const column = await prisma.column.findUnique({
            where: { id }
        });

        if (!column) throw new NotFoundError("Column not found");
        return column;
    }

    static async getFiltered(filters: ColumnFilters, userId?: number): Promise<MappedExtendedColumn[]> {
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

        const mappedColumns = [];
        for (const column of columns) {
            mappedColumns.push(await this.mapExtendedColumn(column, userId));
        }

        return mappedColumns;
    }

    static async countFiltered(filters: ColumnFilters): Promise<number> {
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
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can create columns", 403);

        const newColumn = await prisma.column.create({
            data: column,
            include: { comments: true }
        });

        return this.mapExtendedColumn(newColumn);
    }

    static async update(id: number, column: UpdateColumn, userId: number): Promise<MappedExtendedColumn> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can update columns", 403);

        const updatedColumn = await prisma.column.update({
            where: { id },
            data: column,
            include: { comments: true }
        });

        return await this.mapExtendedColumn(updatedColumn);
    }

    static async updateMortal(id: number, column: MortalUpdateColumn): Promise<MappedExtendedColumn> {
        const updatedColumn = await prisma.column.update({
            where: { id },
            data: column,
            include: { comments: true }
        });

        return await this.mapExtendedColumn(updatedColumn);
    }

    static async delete(id: number, userId: number) {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can delete columns", 403);

        const column = await prisma.column.delete({ where: { id } });
        if (!column.id) throw new NotFoundError("Column not found");
    }

    private static async mapBasicColumn(column: BasicColumn, userId?: number): Promise<MappedColumn> {
        const image = await uploadExists("columnBanners", `${column.id}`)
            ? `/api/columns/banners/${column.id}`
            : null;

        return {
            ...column,
            image,
            likes: column.likes.length,
            dislikes: column.dislikes.length,
            liked: userId ? column.likes.includes(userId) : false,
            disliked: userId ? column.dislikes.includes(userId) : false,
        };
    }

    private static async mapExtendedColumn(column: ExtendedColumn, userId?: number): Promise<MappedExtendedColumn> {
        const image = await uploadExists("columnBanners", `${column.id}`)
            ? `/api/columns/banners/${column.id}`
            : null;

        return {
            ...column,
            image,
            likes: column.likes.length,
            dislikes: column.dislikes.length,
            liked: userId ? column.likes.includes(userId) : false,
            disliked: userId ? column.dislikes.includes(userId) : false,
        };
    }
}

import { NotFoundError } from "elysia";
import prisma from "../utils/prisma";
import { OperationError } from "../utils/errors";
import { BasicComment } from "../models/comment/basic";
import { SelectComment } from "../models/comment/extended";
import { CommentFilters, InsertComment } from "../models/comment/utils";

export abstract class CommentService {
    static async get(id: number): Promise<SelectComment> {
        const comment = await prisma.comment.findUnique({
            where: {
                id
            },
            include: {
                author: true,
                column: true
            }
        });

        if (!comment) throw new NotFoundError("Comment not found");
        return comment;
    }

    static async getSlim(id: number): Promise<BasicComment> {
        const comment = await prisma.comment.findUnique({
            where: {
                id
            }
        });

        if (!comment) throw new NotFoundError("Comment not found");
        return comment;
    }

    static async getFiltered(filters: CommentFilters): Promise<SelectComment[]> {
        const { columnId, authorId, page, limit } = filters;

        const comments = await prisma.comment.findMany({
            where: {
                AND: [
                    { columnId },
                    { authorId }
                ]
            },
            skip: page * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                author: true,
                column: true
            }
        });

        return comments;
    }

    static async countFiltered(filters: CommentFilters): Promise<number> {
        const { columnId, authorId } = filters;

        return await prisma.comment.count({
            where: {
                AND: [
                    { columnId },
                    { authorId }
                ]
            },
        });
    }

    static async create(comment: InsertComment, authorId: number): Promise<SelectComment> {
        const newComment = await prisma.comment.create({
            data: {...comment, authorId},
            include: {
                author: true,
                column: true
            }
        });

        return newComment;
    }

    static async delete(id: number, userId: number) {
        const comment = await this.getSlim(id);

        if (comment.authorId !== userId) throw new OperationError("Comments can be deleted only by their authors or administrators", 403);;

        await prisma.comment.delete({
            where: {
                id
            }
        });
    }
}

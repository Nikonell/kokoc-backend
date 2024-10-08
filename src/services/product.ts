import { NotFoundError } from "elysia";
import prisma from "../utils/prisma";
import { BasicProduct } from "../models/product/basic";
import { ExtendedProduct } from "../models/product/extended";
import { ProductFilters, InsertProduct, UpdateProduct } from "../models/product/utils";
import { UserService } from "./user";
import { OperationError } from "../utils/errors";
import { uploadExists } from "../utils/uploads";

export abstract class ProductService {
    static async get(id: number): Promise<ExtendedProduct> {
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) throw new NotFoundError("Product not found");

        return await this.extendProduct(product);
    }

    static async getSlim(id: number): Promise<BasicProduct> {
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) throw new NotFoundError("Product not found");
        return product;
    }

    static async getFiltered(filters: ProductFilters): Promise<ExtendedProduct[]> {
        const { page, limit, name, maxPrice, minPrice } = filters;

        const whereClause = name ? {
            name: { contains: name, mode: 'insensitive' as const },
            price: { lte: maxPrice, gte: minPrice }
        } : {};

        const products = await prisma.product.findMany({
            where: whereClause,
            skip: page * limit,
            take: limit,
            orderBy: { name: "asc" },
        });

        return await Promise.all(products.map(this.extendProduct));
    }

    static async countFiltered(filters: ProductFilters): Promise<number> {
        const { name, minPrice, maxPrice } = filters;

        const whereClause = name ? {
            name: { contains: name, mode: 'insensitive' as const },
            price: { lte: maxPrice, gte: minPrice }
        } : {};

        return await prisma.product.count({ where: whereClause });
    }

    static async create(product: InsertProduct, userId: number): Promise<ExtendedProduct> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can create products", 403);

        const newProduct = await prisma.product.create({
            data: product,
        });

        return await this.extendProduct(newProduct);
    }

    static async update(id: number, product: UpdateProduct, userId: number): Promise<ExtendedProduct> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can update products", 403);

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: product,
        });

        return await this.extendProduct(updatedProduct);
    }

    static async delete(id: number, userId: number): Promise<void> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only administrators can delete products", 403);

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundError("Product not found");

        await prisma.product.delete({ where: { id } });
    }

    static async extendProduct(product: BasicProduct): Promise<ExtendedProduct> {
        const image = await uploadExists("productImages", `${product.id}`)
            ? `/api/products/images/${product.id}`
            : null;

        return { ...product, image };
    }
}

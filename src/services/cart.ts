import { NotFoundError } from "elysia";
import { ExtendedCart } from "../models/cart/extended";
import prisma from "../utils/prisma";
import { ProductService } from "./product";
import { UserService } from "./user";

export abstract class CartService {
    static async get(userId: number): Promise<ExtendedCart> {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart) return await this.createEmpty(userId);

        const products = await Promise.all(cart.products.map(p => p.product).map(ProductService.extendProduct));
        return { ...cart, products };
    }

    static async createEmpty(userId: number): Promise<ExtendedCart> {
        const user = await UserService.getSlim(userId);
        if (!user) throw new NotFoundError("User not found");

        const cart = await prisma.cart.create({
            data: {
                userId
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const products = await Promise.all(cart.products.map(p => p.product).map(ProductService.extendProduct));
        return { ...cart, products };
    }

    static async addProduct(userId: number, productId: number): Promise<ExtendedCart> {
        const product = await ProductService.getSlim(productId);
        if (!product) throw new NotFoundError("Product not found");

        const cart = await prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) await this.createEmpty(userId);


        const updatedCart = await prisma.cart.update({
            where: { userId },
            data: {
                products: {
                    create: {
                        product: {
                            connect: { id: productId }
                        }
                    }
                }
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const products = await Promise.all(updatedCart.products.map(p => p.product).map(ProductService.extendProduct));
        return { ...updatedCart, products };
    }

    static async removeProduct(userId: number, productId: number): Promise<ExtendedCart> {
        const product = await ProductService.getSlim(productId);
        if (!product) throw new NotFoundError("Product not found");

        const cart = await this.get(userId);
        if (!cart.products.some(p => p.id === productId)) {
            throw new NotFoundError("Product not found in cart");
        }

        const updatedCart = await prisma.cart.update({
            where: { userId },
            data: {
                products: {
                    delete: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId: productId
                        }
                    }
                }
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const products = await Promise.all(updatedCart.products.map(p => p.product).map(ProductService.extendProduct));
        return { ...updatedCart, products };
    }
}

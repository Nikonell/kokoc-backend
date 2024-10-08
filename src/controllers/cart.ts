import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { errorResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { extendedCart } from "../models/cart/extended";
import { CartService } from "../services/cart";

const cartController = new Elysia({ prefix: "/users/me/cart" })
    .use(authMiddleware)
    .get("", async ({ set, auth }) => {
        const id = await auth.id();
        const cart = await CartService.get(id);

        return successResponse(set, cart);
    }, {
        response: {
            200: successResponseType(extendedCart),
            401: unauthorizedResponseType,
            404: errorResponseType(404, "User not found")
        },
        detail: {
            summary: "Get cart",
            description: "Get current authenticated user's cart",
            tags: ["Users"]
        }
    })
    .post("/products/:productId", async ({ set, auth, params }) => {
        const id = await auth.id();
        const cart = await CartService.addProduct(id, params.productId);

        return successResponse(set, cart);
    }, {
        params: t.Object({
            productId: t.Number()
        }),
        response: {
            200: successResponseType(extendedCart),
            401: unauthorizedResponseType,
            404: errorResponseType(404, "User not found")
        },
        detail: {
            summary: "Add product to cart",
            description: "Add product to current authenticated user's cart",
            tags: ["Users"]
        }
    })
    .delete("/products/:productId", async ({ set, auth, params }) => {
        const id = await auth.id();
        const cart = await CartService.removeProduct(id, params.productId);

        return successResponse(set, cart);
    }, {
        params: t.Object({
            productId: t.Number()
        }),
        response: {
            200: successResponseType(extendedCart),
            401: unauthorizedResponseType,
            404: errorResponseType(404, "User not found")
        },
        detail: {
            summary: "Remove product from cart",
            description: "Remove product from current authenticated user's cart",
            tags: ["Users"]
        }
    });

export default cartController;

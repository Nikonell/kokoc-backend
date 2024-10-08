import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { insertProduct, productFilters } from "../models/product/utils";
import { errorResponseType, paginatedResponse, paginatedResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { extendedProduct } from "../models/product/extended";
import { ProductService } from "../services/product";

const productController = new Elysia({ prefix: "/products" })
    .use(authMiddleware)
    .get("", async ({ set, query }) => {
        const products = await ProductService.getFiltered(query);
        const total = await ProductService.countFiltered(query);

        return paginatedResponse(set, products, total, query.page, query.limit);
    }, {
        query: productFilters,
        response: { 200: paginatedResponseType(extendedProduct) },
        detail: {
            summary: "Get all",
            description: "Get all products",
            tags: ["Products"]
        }
    })
    .get("/:id", async ({ set, params }) => {
        const product = await ProductService.get(params.id);

        return successResponse(set, product);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            200: successResponseType(extendedProduct),
            404: errorResponseType(404, "Product not found")
        },
        detail: {
            summary: "Get by id",
            description: "Get a product by id",
            tags: ["Products"]
        }
    })
    .post("", async ({ set, body, auth }) => {
        const userId = await auth.id();
        const product = await ProductService.create(body, userId);

        return successResponse(set, product, 201);
    }, {
        body: insertProduct,
        response: {
            201: successResponseType(extendedProduct),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can create products")
        },
        detail: {
            summary: "Create",
            description: "Create a product",
            tags: ["Products"]
        }
    })
    .patch("/:id", async ({ set, params, body, auth }) => {
        const userId = await auth.id();
        const product = await ProductService.update(params.id, body, userId);

        return successResponse(set, product);
    }, {
        params: t.Object({ id: t.Number() }),
        body: insertProduct,
        response: {
            200: successResponseType(extendedProduct),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can update products"),
            404: errorResponseType(404, "Product not found")
        },
        detail: {
            summary: "Update",
            description: "Update a product",
            tags: ["Products"]
        }
    })
    .delete("/:id", async ({ set, params, auth }) => {
        const userId = await auth.id();
        await ProductService.delete(params.id, userId);

        return successResponse(set, null, 204);
    }, {
        params: t.Object({ id: t.Number() }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only administrators can delete products"),
            404: errorResponseType(404, "Product not found")
        },
        detail: {
            summary: "Delete",
            description: "Delete a product",
            tags: ["Products"]
        }
    });

export default productController;

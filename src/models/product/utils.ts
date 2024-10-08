import { t } from "elysia";
import { basicProduct } from "./basic";

// Insert
export const insertProduct = t.Omit(basicProduct, ["id", "createdAt"]);
export type InsertProduct = typeof insertProduct.static;

// Filters
export const productFilters = t.Object({
    page: t.Number({default: 0}),
    limit: t.Number({default: 10}),
    name: t.Optional(t.String({ minLength: 1, maxLength: 256 })),
    minPrice: t.Optional(t.Number({ minimum: 0 })),
    maxPrice: t.Optional(t.Number({ minimum: 0 }))
});
export type ProductFilters = typeof productFilters.static;

// Update
export const updateProduct = t.Mapped(
    t.KeyOf(t.Omit(basicProduct, ["id", "createdAt"])),
    K => t.Optional(t.Index(basicProduct, K))
);
export type UpdateProduct = typeof updateProduct.static;

import { t } from "elysia";

export const basicCart = t.Object({
    id: t.Number({ minimum: 1 }),
    createdAt: t.Date(),
    userId: t.Number({ minimum: 1 }),
});
export type BasicCart = typeof basicCart.static;

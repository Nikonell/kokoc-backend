import { t } from "elysia";

// Basic
export const basicUser = t.Object({
    id: t.Number({ minimum: 1 }),
    createdAt: t.Date(),
    isAdmin: t.Boolean(),
    email: t.String({ format: "email" }),
    firstName: t.String({ minLength: 2, maxLength: 64 }),
    lastName: t.String({ minLength: 2, maxLength: 64 }),
    viewedMatches: t.Array(t.Number({ minimum: 1 })),
});
export type BasicUser = typeof basicUser.static;

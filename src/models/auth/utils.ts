import { t } from "elysia";

export const loginUserRequest = t.Object({
    email: t.String(),
    password: t.String(),
});
export type LoginUserRequest = typeof loginUserRequest.static;

export const registerUserRequest = t.Object({
    firstName: t.String({minLength: 2, maxLength: 64}),
    lastName: t.String({minLength: 2, maxLength: 64}),
    email: t.String({format: "email"}),
    password: t.RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/),
});
export type RegisterUserRequest = typeof registerUserRequest.static;

export const authResponse = t.Null();
export type AuthResponse = typeof authResponse.static;

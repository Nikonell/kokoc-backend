import { StatusMap, t, type TSchema } from "elysia";

interface SetObject {
    status?: number | keyof StatusMap;
}

export const successResponse = <T>(set: SetObject, data: T, status = 200) => {
    set.status = status;
    return {
        status: "success",
        data,
    } as { status: "success"; data: T };
};

export const validationErrorResponse = <T>(set: SetObject, data: T, status: number) => {
    set.status = status;
    return {
        status: "validation_error",
        data,
    } as { status: "validation_error"; data: T };
};

export const errorResponse = (set: SetObject, message: string, status = 500) => {
    set.status = status;
    return {
        status: "error",
        message,
    } as { status: "error"; message: string };
};

export const paginatedResponse = <T>(set: SetObject, items: T[], total: number, page: number, limit: number, hasNext: boolean) => {
    set.status = 200;
    return successResponse(set, {
        items,
        total,
        page,
        limit,
        hasNext
    });
}

export const successResponseType = (dataType: TSchema) =>
    t.Object({
        status: t.Literal("success"),
        data: dataType,
    });

export const validationErrorResponseType = (dataType: TSchema) =>
    t.Object({
        status: t.Literal("validation_error"),
        data: dataType,
    });

export const errorResponseType = (code: number = 500, message?: string) =>
    t.Object({
        status: t.Literal("error"),
        code: t.Literal(code),
        message: message ? t.Literal(message) : t.Undefined(),
    });

export const paginatedResponseType = (dataType: TSchema) =>
    successResponseType(t.Object({
        items: t.Array(dataType),
        total: t.Number(),
        page: t.Number(),
        limit: t.Number(),
        hasNext: t.Boolean()
    }));

export const unauthorizedResponseType = errorResponseType(StatusMap.Unauthorized, "Unauthorized");

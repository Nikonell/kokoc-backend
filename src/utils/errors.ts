import Elysia, { StatusMap } from "elysia";

export class UnauthorizedError extends Error {
    status = StatusMap.Unauthorized;

    constructor() {
        super("Unauthorized");
    }
}

export class OperationError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export const errorsDefinition = new Elysia()
    .error({
        UNAUTHORIZED: UnauthorizedError,
        OPERATION: OperationError,
    });

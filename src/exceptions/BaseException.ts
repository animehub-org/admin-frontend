import type {ErrorCode} from "../types/ResponseType.ts";

export class BaseException extends Error {
    protected readonly errCode: ErrorCode;

    constructor(error: Error, errCode: ErrorCode);
    constructor(errCode: ErrorCode, message?: string, name?:string, options?: ErrorOptions);

    constructor(
        errCode: ErrorCode | Error,
        messageOrErrCode?: string | ErrorCode,
        name?: string,
        options?: ErrorOptions
    ) {
        // If the first argument is an Error object
        if (errCode instanceof Error) {
            super(errCode.message, options);
            this.name = errCode.name;
            this.errCode = messageOrErrCode as ErrorCode;
        } else {
            // Your original constructor logic
            super(messageOrErrCode, options);
            if (name != null) {
                this.name = name;
            }
            this.errCode = errCode;
        }
    }

    public getErrCode(): ErrorCode{
        return this.errCode;
    }
}
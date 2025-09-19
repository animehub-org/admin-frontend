import {BaseException} from "./BaseException.ts";
import {ErrorCode} from "../types/ResponseType.ts";

export class UserException extends BaseException {
    constructor(message?: string, options?: ErrorOptions) {
        super(ErrorCode.USER_ERROR,message, "UserError", options);
    }
}
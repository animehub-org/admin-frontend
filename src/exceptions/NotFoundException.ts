import {BaseException} from "./BaseException.ts";
import {ErrorCode} from "../types/ResponseType.ts";

export class NotFoundException extends BaseException {
    constructor(type: string, options?: ErrorOptions) {
        super(ErrorCode.NOT_FOUND,`Not ${type} found`, "NotFoundException", options);
    }
}
// import type {ErrorCode} from "./ResponseType.ts";
import type {BaseException} from "../exceptions/BaseException.ts";

export type BaseState = {
    err: BaseException | null;
    title?: string,
    loading:boolean,
    status?:string,
}

export type BaseProps = {
    params?: object
}
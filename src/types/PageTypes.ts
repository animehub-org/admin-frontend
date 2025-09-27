// import type {ErrorCode} from "./ResponseType.ts";
import type {BaseException} from "../exceptions/BaseException.ts";

export type BaseState = {
    err: BaseException | null;
    loading:boolean,
}
export type PageState = BaseState & {
    title: string | null,
}

export type BaseProps = {
    params?: object
}
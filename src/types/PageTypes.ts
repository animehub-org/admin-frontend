// import type {ErrorCode} from "./ResponseType.ts";
import type {BaseException} from "../exceptions/BaseException.ts";
import type {FormState} from "./FormOption.ts";

export type BaseState = {
    err: BaseException | null;
    loading:boolean,
}
export type PageState = BaseState & {
    title: string | null,
}

export type CreationPageState<T> = PageState & FormState<T>

export type BaseProps = {
    params?: object
}
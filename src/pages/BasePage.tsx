import React from "react";
import axios, {type AxiosError, type AxiosResponse} from "axios";
import type {Anime} from "../types/Anime.ts";
import "../css/base.scss"
import Footer from "../components/Footer.tsx";
import {Header} from "../components/Header.tsx";
import type {BaseProps, BaseState} from "../types/PageTypes.ts";
import {ErrorCode, type ResponseType} from "../types/ResponseType.ts";
import {AUTH_URL, USER_URL} from "../Consts.ts";
import {EncryptException} from "../exceptions/EncryptException.ts";
import {JSEncrypt} from "jsencrypt";
import {BaseComponent} from "../types/BaseComponent.tsx";
import {NotFoundException} from "../exceptions/NotFoundException.ts";
import {InternalServerErrorException} from "../exceptions/InternalServerErrorException.ts";
import {BaseException} from "../exceptions/BaseException.ts";

abstract class BasePage<P extends BaseProps, S extends BaseState> extends BaseComponent<P, S>{
    public constructor(props: P, initialState: S);
    public constructor(initialState: S);

    public constructor(arg1: P | S, arg2?: S) {
        if (arg2) {
            super(arg1 as P);
            this.state = arg2;
        } else {
            super({} as P);
            this.state = arg1 as S;
        }
    }

    componentDidMount() {
        document.title = `${this.state.title} - Animefoda`
    }

    private handleError(error: unknown){
        if (axios.isAxiosError(error)) {
            const apiError = error as AxiosError<ResponseType<string>>;
            if (apiError.response && apiError.response.data) {
                const errData = apiError.response.data;
                throw new BaseException(errData.errorCode,errData.message,errData.errorCode);
            } else {
                throw new InternalServerErrorException(error.message);
            }
        } else {
            throw new InternalServerErrorException("An unknown error occurred.");
        }
    }

    protected async executeAsync<T>(task: () => Promise<T>): Promise<T | null> {
        this.setState({ loading: true });
        try {
            const result = await task();
            this.setState({ err: null, loading: false });
            return result;
        } catch (error:unknown) {
            const exception = this.handleError(error);
            this.setState({err: exception, loading: false} as unknown as Pick<S, "err" | "loading">);
            return null;
        }
    }

    protected getError(err: BaseException|null){
        if (!err) {
            return (
                <div className="error-wrapper">
                    <p className="error">An unknown error occurred.</p>
                </div>
            );
        }
        const hasErrCodeMethod = typeof (err as BaseException).getErrCode === 'function';

        return (
            <div className="error-wrapper">
                <p className="error"><b>Erro ao carregar a pagina: </b></p>
                <p className="error-reason">{err.name}</p>
                <p className="error-status">{err.message}</p>
                {hasErrCodeMethod && (
                    <p className="error-status">CODE: {err.getErrCode()}</p>
                )}
            </div>
        );
    }

    protected async getFromAuth<T>(url: string): Promise<AxiosResponse<ResponseType<T>>|null>{
        return this.executeAsync(async()=>{
            return await this.get<T>(`${AUTH_URL}/g${url}`)
        })
    }
    protected async postToAuth<T,D>(url:string, data:D): Promise<AxiosResponse<ResponseType<T>>|null>{
        return this.executeAsync(async()=>{
            const fingerprint = await this.getFingerprint();
            const headers = {
                "FP": fingerprint.visitorId,
            }
            return await this.post<T,D>(`${AUTH_URL}${url}`, data,headers)
        })

    }


    protected async getFromUser<T>(url:string): Promise<AxiosResponse<ResponseType<T>>|null> {
        return this.executeAsync(async()=>{
            const fingerprint = await this.getFingerprint();
            const headers = {
                "FP": fingerprint.visitorId,
            }
            return await this.get(`${USER_URL}/g${url}`, headers)
        })

    }
    protected async postToUser<T,D>(url:string,data:D): Promise<AxiosResponse<ResponseType<T>>|null>{
        return this.executeAsync(async ()=>{
            const fingerprint = await this.getFingerprint();
            const headers = {
                "FP": fingerprint.visitorId,
            }
            return await this.post<T,D>(`${USER_URL}/p${url}`, data, headers)
        })
    }

    protected async encryptData<T>(data:T): Promise<string> {
        const publicKey = await this.getFromAuth<string>("/keys/public")
        if(!publicKey || !publicKey.data.success){
            throw new EncryptException("Falha ao obter chave publica")
        }

        const jse = new JSEncrypt();
        jse.setPublicKey(publicKey.data.data);
        const stringData = JSON.stringify(data)
        const encryptedData = jse.encrypt(stringData);

        if(encryptedData === false){
            throw new EncryptException("Falha ao encriptar")
        }
        return encryptedData
    }


    protected idNotFound(type:string){
        this.setState({
            err: new NotFoundException(type),
        })
    }

    protected async getAnime(id:string):Promise<Anime|null>{
        try {
            return (await this.getFromApi<Anime|null>(`/anime/${id}`, null)).data.data;
        } catch (error: unknown) {
            console.log(error);
            if(error instanceof BaseException){
                this.setState({
                    err: error
                })
            }else if(axios.isAxiosError(error)){
                const response = error.response?.data as ResponseType<string>;
                console.log(response);
                this.setState({
                    err: new BaseException(response.errorCode, response.message)
                })
            } else {
                this.setState({
                    err: new BaseException(
                        ErrorCode.UNKNOWN_ERROR,
                        (error as Error).message || "An unknown error occurred."
                    )
                })
            }
            return null;
        }
    }

    protected abstract renderContent(): React.ReactNode;

    render(){
        return(
            <>
                <Header/>
                    {this.state.err ? (
                        this.getError(this.state.err)
                    ) : this.renderContent()}
                <Footer/>
            </>
        )
    }
}

export default BasePage;
import React from "react";
import axios, { type AxiosResponse} from "axios";
import type {Anime} from "../types/Anime.ts";
import "../css/base.scss"
import Footer from "../components/Footer.tsx";
import {Header} from "../components/Header.tsx";
import type {BaseProps, PageState} from "../types/PageTypes.ts";
import {ErrorCode, type ResponseType} from "../types/ResponseType.ts";
import {USER_URL} from "../Consts.ts";
import {EncryptException} from "../exceptions/EncryptException.ts";
import {JSEncrypt} from "jsencrypt";
import {BaseComponent} from "../types/BaseComponent.tsx";
import {NotFoundException} from "../exceptions/NotFoundException.ts";
import {BaseException} from "../exceptions/BaseException.ts";
import {UserContext} from "../contexts/UserContext.tsx";

abstract class BasePage<P extends BaseProps, S extends PageState> extends BaseComponent<P, S>{
    static contextType = UserContext;
    declare context: React.ContextType<typeof UserContext>;

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
        if(this.context.isLoggedIn && !this.context.isAdmin){
            alert("Not an admin")
            // this.context.logout();
            //placeholder for the actual url
            // window.location.href = "http://localhost:5173"
        }
        document.title = `${this.state.title} - Animefoda`
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
            return (await this.getFromApi<Anime|null>(`/anime/${id}`, null))!.data.data;
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
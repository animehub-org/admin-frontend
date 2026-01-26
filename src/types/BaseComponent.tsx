import React from "react";
import axios, {type AxiosError, type AxiosResponse} from "axios";
import type {ResponseType} from "./ResponseType.ts";
import {ADMIN_URL, API_URL, AUTH_URL} from "../Consts.ts";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import type {BaseState} from "./PageTypes.ts";
import {BaseException} from "../exceptions/BaseException.ts";
import {InternalServerErrorException} from "../exceptions/InternalServerErrorException.ts";

export class BaseComponent<P = object, S extends BaseState = BaseState> extends React.PureComponent<P, S> {

    protected async get<T>(url: string, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        const headers = {
            ...header,
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        }
        return await axios.get<ResponseType<T>>(url, {headers})
    }

    protected async post<T, D>(url: string, data: D, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            ...header,
        }
        return await axios.post(url, data, {headers: headers})
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
    protected async getFromAdminApi<T>(url: string, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>|null> {
        return this.executeAsync(async()=>{
            const fingerprint = await this.getFingerprint();
            const headers = {
                ...header,
                "FP": fingerprint.visitorId,
            }
            return this.get<T>(`${ADMIN_URL}${url}`, headers)
        })
        // return await this.getFromApiWithToken<T>(`${ADMIN_URL}/g${url}`, header)
    }

    protected async postToAdminApi<T,D>(url:string, data: D, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>|null> {
        return this.executeAsync(async()=>{
            const fingerprint = await this.getFingerprint();
            const headers = {
                ...header,
                "FP": fingerprint.visitorId,
            }
            return this.post<T,D>(`${ADMIN_URL}${url}`, data,headers)
        })
        // return await this.postToApiWithToken(`${ADMIN_URL}/p${url}`, data, headers)
    }


    protected async getFromApi<T>(url: string, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>|null> {
        return this.executeAsync(async()=>{
            return this.get<T>(`${API_URL}${url}`, header)
        })
        // return await this.get<T>(`${API_URL}/g${url}`, header)
    }

    protected async postToApi<T,D>(url:string, data: D, headers: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        return await this.post(`${API_URL}/p${url}`, data, headers)
    }

    protected async getFromApiWithToken<T>(url: string, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>|null> {
        const fingerprint = await this.getFingerprint();
        const headers = {
            ...header,
            // "Authorization": `Bearer ${header}`,
            "FP": fingerprint.visitorId
        }
        return await this.getFromApi(url, headers);
    }

    protected async postToApiWithToken<T,D>(url: string, data: D, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        const fingerprint = await this.getFingerprint();
        const headers = {
            ...header,
            // "Authorization": `Bearer ${header}`,
            "FP": fingerprint.visitorId
        }
        return await this.postToApi<T, D>(url, data, headers)
    }
    protected async getFingerprint(){
        const fp = await FingerprintJS.load();
        return await fp.get();
    }
}
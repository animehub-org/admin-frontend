import React from "react";
import axios, {type AxiosResponse} from "axios";
import type {ResponseType} from "./ResponseType.ts";
import {API_URL} from "../Consts.ts";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export class BaseComponent<P,S> extends React.PureComponent<P,S>{
    protected async get<T>(url: string, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        const headers = {
            ...header,
        }
        return await axios.get<ResponseType<T>>(url, {headers})
    }

    protected async post<T, D>(url: string, data: D, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        const headers = {
            "Content-Type": "application/json",
            ...header,
        }
        return await axios.post(url, data, {headers: headers})
    }

    protected async getFromApi<T>(url: string, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        return await this.get<T>(`${API_URL}/g${url}`, header)
    }

    protected async postToApi<T,D>(url:string, data: D, headers: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        return await this.post(`${API_URL}/p${url}`, data, headers)
    }

    protected async getFromApiWithToken<T>(url: string, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        const fingerprint = await this.getFingerprint();
        const headers = {
            ...header,
            "Authorization": `Bearer ${header}`,
            "FP": fingerprint.visitorId
        }
        return await this.getFromApi(url, headers);
    }

    protected async postToApiWithToken<T,D>(url: string, data: D, header: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
        const fingerprint = await this.getFingerprint();
        const headers = {
            ...header,
            "Authorization": `Bearer ${header}`,
            "FP": fingerprint.visitorId
        }
        return await this.postToApi<T, D>(url, data, headers)
    }
    protected async getFingerprint(){
        const fp = await FingerprintJS.load();
        return await fp.get();
    }
}
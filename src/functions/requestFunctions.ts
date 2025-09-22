// import axios, {AxiosError, type AxiosResponse} from "axios";
// import {JSEncrypt} from "jsencrypt";
// // import {apiUrl} from "../const";
// import type ResponseType from "../types/ResponseType";
// import {getDeviceIndentifier} from "./userFunctions";
// import {API_URL, AUTH_URL} from "../Consts.ts";
//
// export async function get<T> (url:string, headers: object | null = null) : Promise<AxiosResponse<ResponseType<T>>> {
//     const header = {
//         "Content-Type": "application/json",
//         ...headers,
//     }
//     return await axios.get(url, {headers: header});
// }
//
// export async function post<T, D>(url: string, data: D, headers: object | null = null) : Promise<AxiosResponse<ResponseType<T>>> {
//     const header = {
//         "Content-Type": "application/json",
//         ...headers,
//     }
//     return await axios.post<T,D>(url, header, data);
// }
//
// export async function getFromApi<T>(url: string, headers: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
//     const response = await get<T>(url, headers);
//     if(response.status !== 200){
//         throw new AxiosError(response.data.message);
//     }
//     return response;
// }
//
// export async function postToApi<T,R>(url: string, data: T, headers: object | null = null): Promise<AxiosResponse<ResponseType<R>>> {
//     const response = await post<R,T>(url, data, headers);
//     if(response.status !== 200){
//         throw new AxiosError(response.data.message);
//     }
//     return response;
// }
//
// export async function getFromApiWithToken<T>(url: string):Promise<AxiosResponse<ResponseType<T>>>{
//     const identifier = getDeviceIndentifier()
//     const response = await getFromApi<T>(url,{
//         'timeZone': identifier.timeZone,
//         'webGlRenderer': identifier.WegGl?.renderer,
//         'webGlVendor': identifier.WegGl?.vendor,
//         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//     })
//
//     if(response.status !== 200){
//         throw new AxiosError(response.data.message);
//     }
//     return response;
// }
//
// export async function postToApiWithToken<T,R>(url: string, data: T):Promise<AxiosResponse<ResponseType<R>>>{
//     const identifier = getDeviceIndentifier()
//     const response = await postToApi<T,R>(url,data,{
//         'timeZone': identifier.timeZone,
//         'webGlRenderer': identifier.WegGl?.renderer,
//         'webGlVendor': identifier.WegGl?.vendor,
//         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//     })
//     if(response.status !== 200){
//         throw new AxiosError(response.data.message);
//     }
//     return response;
// }
//
// // export async function fetchUser(
// //     path: string,
// //     method: "POST" | "DELETE" | "PATCH" | "GET" = "POST",
// //     body?: any,
// //     retry: boolean = true
// // ): Promise<Response> {
// //     const identifier = getDeviceIndentifier()
// //     let response = await fetch(path, {
// //         method,
// //         headers: {
// //             'Content-Type': "application/json",
// //             'timeZone': identifier.timeZone,
// //             'webGlRenderer': identifier.WegGl?.renderer,
// //             'webGlVendor': identifier.WegGl?.vendor,
// //             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
// //         },
// //         body: JSON.stringify(body)
// //     })
// //     if (!response.ok && response.status === 401 && retry) {
// //         await refreshToken()
// //         response = await fetchUser(path, method, body, false)
// //     }
// //     return response
// // }
//
// export async function encryptData(data:object): Promise<string>{
//     const publicKeyResponse = await fetch(`${AUTH_URL}/keys/public`)
//     if(!publicKeyResponse.ok){
//         throw new AxiosError("Public Key not available")
//     }
//     const json = JSON.stringify(data);
//     const publicKey = await publicKeyResponse.text()
//     console.log(publicKey)
//     const jse = new JSEncrypt();
//     jse.setPublicKey(publicKey);
//     const encryptedData = jse.encrypt(json);
//     if(!encryptedData){
//         throw new Error("Unable to encrypt data")
//     }
//     return encryptedData;
//
// }
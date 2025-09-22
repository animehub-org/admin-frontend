import type User from "../types/User.ts";
import type {UserRole} from "../types/Role.ts";

export function getDeviceIndentifier() {
    const fingerprint = {
        userAgent:navigator.userAgent,
        timeZone:getTimeZone(),
        WegGl:getWebGLFingerprint()
    }
    return fingerprint
}
//Funções para pegar as coisas do digest
//mais facil pra debugar
function getWebGLFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;

        if (!gl) return null;

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            return { vendor, renderer };
        }

        return null
    } catch (e) {
        console.error(e);
        return null;
    }
}
function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function checkIsLogged(isLogged: boolean) {
    if (!isLogged) {
        alert("Nenhuma conta conectada")
        window.location.href = '/login/'
    }
}

export async function fetchPost(path: string, method: "POST" | "DELETE" | "PATCH" = "POST", body?: any) {
    return await fetch(path, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
}
export function userHasRole(user: User, role: UserRole): boolean {
    return user.roles.some(r => r.name === role);
}

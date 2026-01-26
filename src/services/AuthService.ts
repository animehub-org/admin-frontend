import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { AUTH_URL } from "../Consts";

// Tipos do OAuth2
export interface OAuth2TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
}

export interface OAuth2LoginRequest {
    username: string;
    password: string;
}

/**
 * Serviço de autenticação OAuth2 para o Admin Frontend
 * Usa o fluxo Password Grant com cliente público (sem secret)
 */
export class AuthService {
    private static readonly CLIENT_ID = "admin-frontend";
    private static readonly SCOPES = "openid profile admin.read admin.write";
    private static readonly TOKEN_ENDPOINT = `${AUTH_URL}/oauth2/token`;

    /**
     * Faz login usando OAuth2 Password Grant
     */
    static async login(username: string, password: string): Promise<OAuth2TokenResponse> {
        const fingerprint = await this.getFingerprint();

        const params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("client_id", this.CLIENT_ID);
        params.append("username", username);
        params.append("password", password);
        params.append("scope", this.SCOPES);
        params.append("fingerprint", fingerprint);

        const response = await fetch(this.TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error_description || error.error || "Login failed");
        }

        const tokenResponse: OAuth2TokenResponse = await response.json();

        // Salva os tokens
        this.saveTokens(tokenResponse);

        return tokenResponse;
    }

    /**
     * Atualiza o access token usando o refresh token
     */
    static async refreshToken(): Promise<OAuth2TokenResponse | null> {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            return null;
        }

        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("client_id", this.CLIENT_ID);
        params.append("refresh_token", refreshToken);

        try {
            const response = await fetch(this.TOKEN_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            });

            if (!response.ok) {
                this.clearTokens();
                return null;
            }

            const tokenResponse: OAuth2TokenResponse = await response.json();
            this.saveTokens(tokenResponse);
            return tokenResponse;
        } catch {
            this.clearTokens();
            return null;
        }
    }

    /**
     * Faz logout removendo os tokens
     */
    static logout(): void {
        this.clearTokens();
    }

    /**
     * Verifica se o usuário está logado
     */
    static isLoggedIn(): boolean {
        const accessToken = localStorage.getItem("accessToken");
        const expiresAt = localStorage.getItem("expiresAt");

        if (!accessToken || !expiresAt) {
            return false;
        }

        // Verifica se o token ainda é válido
        const expirationTime = parseInt(expiresAt, 10);
        return Date.now() < expirationTime;
    }

    /**
     * Retorna o access token atual
     */
    static getAccessToken(): string | null {
        return localStorage.getItem("accessToken");
    }

    /**
     * Retorna o refresh token atual
     */
    static getRefreshToken(): string | null {
        return localStorage.getItem("refreshToken");
    }

    /**
     * Decodifica o JWT para extrair as claims
     */
    static decodeToken(token: string): Record<string, unknown> | null {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    }

    /**
     * Extrai as roles do token
     */
    static getRolesFromToken(): string[] {
        const token = this.getAccessToken();
        if (!token) return [];

        const decoded = this.decodeToken(token);
        if (!decoded) return [];

        return (decoded.roles as string[]) || [];
    }

    /**
     * Verifica se o usuário tem uma role específica
     */
    static hasRole(role: string): boolean {
        const roles = this.getRolesFromToken();
        return roles.includes(role);
    }

    /**
     * Extrai o User ID do token (claim 'sub')
     */
    static getUserIdFromToken(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;

        const decoded = this.decodeToken(token);
        if (!decoded) return null;

        return decoded.sub as string || null;
    }

    // --- Private methods ---

    private static saveTokens(response: OAuth2TokenResponse): void {
        localStorage.setItem("accessToken", response.access_token);
        localStorage.setItem("refreshToken", response.refresh_token);

        // Calcula o timestamp de expiração
        const expiresAt = Date.now() + response.expires_in * 1000;
        localStorage.setItem("expiresAt", expiresAt.toString());
    }

    private static clearTokens(): void {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("user");
    }

    private static async getFingerprint(): Promise<string> {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    }
}

export default AuthService;

import type User from "../types/User.ts";
import { createContext, type ReactNode } from "react";
import * as React from "react";
import type { BaseState } from "../types/PageTypes.ts";
import { UserRole } from "../types/Role.ts";
import { BaseComponent } from "../types/BaseComponent.tsx";
import AuthService from "../services/AuthService.ts";
import { USER_URL } from "../Consts.ts";
import axios from "axios";

export interface UserContextProps {
    isLoggedIn: boolean
    isAdmin: boolean
    isSuperAdmin: boolean
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

type UserContextState = BaseState & {
    isLoggedIn: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    user: User | null;
};

export const UserContext = createContext<UserContextProps>({
    isLoggedIn: false,
    isAdmin: false,
    isSuperAdmin: false,
    user: null,
    login: async () => { },
    logout: () => { },
})

export class UserProvider extends BaseComponent<{ children: ReactNode }, UserContextState> {

    state: UserContextState = {
        isLoggedIn: false,
        isAdmin: false,
        isSuperAdmin: false,
        user: null,
        err: null,
        loading: true
    }

    private checkLoginStatus = async () => {
        try {
            // Verifica se há token válido
            if (!AuthService.isLoggedIn()) {
                // Tenta refresh token
                const refreshed = await AuthService.refreshToken();
                if (!refreshed) {
                    this.setState({ loading: false });
                    return;
                }
            }

            // Verifica se tem role de admin no token
            const hasAdminRole = AuthService.hasRole(UserRole.ADMIN);
            if (!hasAdminRole) {
                alert("Você não tem permissão de administrador");
                AuthService.logout();
                this.setState({ loading: false });
                return;
            }

            // Busca dados completos do usuário na API
            const user = await this.fetchUserData();
            if (user) {
                this.setState({
                    isLoggedIn: true,
                    isAdmin: true,
                    isSuperAdmin: user.superUser,
                    user,
                    loading: false
                });
            } else {
                this.setState({ loading: false });
            }
        } catch (e) {
            console.error("Error checking login status:", e);
            AuthService.logout();
            this.setState({ loading: false });
        }
    }

    private fetchUserData = async (): Promise<User | null> => {
        try {
            const accessToken = AuthService.getAccessToken();
            if (!accessToken) return null;

            const response = await axios.get<{ data: User }>(`${USER_URL}/me`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            return response.data.data;
        } catch (e) {
            console.error("Error fetching user data:", e);
            return null;
        }
    }

    public login = async (username: string, password: string) => {
        try {
            // Faz login via OAuth2
            await AuthService.login(username, password);

            // Verifica se tem role de admin
            const hasAdminRole = AuthService.hasRole(UserRole.ADMIN);
            if (!hasAdminRole) {
                AuthService.logout();
                throw new Error("Você não tem permissão de administrador");
            }

            // Busca dados do usuário
            const user = await this.fetchUserData();
            if (!user) {
                AuthService.logout();
                throw new Error("Não foi possível carregar dados do usuário");
            }

            const isSuperAdmin = user.superUser;

            this.setState({
                isLoggedIn: true,
                user,
                isAdmin: hasAdminRole,
                isSuperAdmin
            });
        } catch (error) {
            AuthService.logout();
            throw error;
        }
    };

    public logout = async () => {
        AuthService.logout();

        this.setState({
            isLoggedIn: false,
            user: null,
            isAdmin: false,
            isSuperAdmin: false
        });
    };

    componentDidMount() {
        this.checkLoginStatus();
    }

    render() {
        const { isLoggedIn, isAdmin, isSuperAdmin, user, err } = this.state;
        const contextValue = {
            isLoggedIn,
            isAdmin,
            isSuperAdmin,
            user,
            login: this.login,
            logout: this.logout
        };

        if (err) {
            return <React.StrictMode>{err.message}</React.StrictMode>;
        }

        return <UserContext.Provider value={contextValue}>
            {this.props.children}
        </UserContext.Provider>;
    }
}
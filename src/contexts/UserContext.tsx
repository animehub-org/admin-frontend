import type User from "../types/User.ts";
import {createContext, type ReactNode} from "react";
import * as React from "react";
import type {BaseState} from "../types/PageTypes.ts";
import {UserRole} from "../types/Role.ts";
import type {AuthResponse} from "../types/LoginTypes.ts";

export interface UserContextProps {
    isLoggedIn: boolean
    isAdmin: boolean
    isSuperAdmin: boolean
    user: User | null;
    login: (response: AuthResponse) => void;
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
    login: ()=>{},
    logout: ()=>{},
})

export class UserProvider extends React.PureComponent<{children: ReactNode}, UserContextState>{

    state: UserContextState = {
        status: "",
        title: null,
        isLoggedIn: false,
        isAdmin: false,
        isSuperAdmin: false,
        user: null,
        err: null,
        loading: true
    }

    private checkLoginStatus = () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const expiresIn = localStorage.getItem("expiresIn");
        const userStorage = localStorage.getItem("user")

        if (accessToken && refreshToken && expiresIn && userStorage) {
            const user: User = JSON.parse(userStorage);
            this.setState({
                isLoggedIn: true,
                user,
                isAdmin: user.roles.some(role => role.name === UserRole.ADMIN),
                isSuperAdmin: user.superUser
            });
        }
    }

    public login = (response: AuthResponse) => {
        // Salva os tokens no localStorage
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("expiresIn", response.expiresAt);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Verifica os papéis do usuário
        const isAdmin = response.user.roles.some(role => role.name === UserRole.ADMIN);
        const isSuperAdmin = response.user.superUser

        // Atualiza o estado
        this.setState({
            isLoggedIn: true,
            user: response.user,
            isAdmin,
            isSuperAdmin
        });
    };

    public logout = () => {
        // Remove os tokens e limpa o localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresIn");
        localStorage.removeItem("user");

        // Atualiza o estado para deslogado
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
        const {isLoggedIn, isAdmin, isSuperAdmin, user, err} = this.state;
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
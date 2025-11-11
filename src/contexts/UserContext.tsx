import type User from "../types/User.ts";
import {createContext, type ReactNode} from "react";
import * as React from "react";
import type {BaseState} from "../types/PageTypes.ts";
import {UserRole} from "../types/Role.ts";
import type {AuthResponse} from "../types/LoginTypes.ts";
import {BaseComponent} from "../types/BaseComponent.tsx";

export interface UserContextProps {
    isLoggedIn: boolean
    isAdmin: boolean
    isSuperAdmin: boolean
    user: User | null;
    login: (response: AuthResponse) => Promise<void>;
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
    login: async ()=>{},
    logout: ()=>{},
})

export class UserProvider extends BaseComponent<{children: ReactNode}, UserContextState>{

    state: UserContextState = {
        isLoggedIn: false,
        isAdmin: false,
        isSuperAdmin: false,
        user: null,
        err: null,
        loading: true
    }

    private checkLoginStatus = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const expiresIn = localStorage.getItem("expiresIn");
        // const userStorage = localStorage.getItem("user")

        try{
            if (accessToken && refreshToken && expiresIn) {
                const response = await this.getFromAuth<boolean>(`/validate/${UserRole.ADMIN}`)
                if(!response?.data.data){
                    alert("Not Admin")
                    return;
                }
                this.setState({isLoggedIn: true, isAdmin: true})
            }
        }catch(e){
            this.logout()
        }
    }

    public login = async (response: AuthResponse) => {
        // Salva os tokens no localStorage
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("expiresIn", response.expiresAt);
        // localStorage.setItem("user", JSON.stringify(response.user));

        // Verifica os papéis do usuário
        const isAdmin = response.user.roles.some(role => role.name === UserRole.ADMIN);
        const isSuperAdmin = response.user.superUser

        // Atualiza o estado
        await this.setState({
            isLoggedIn: true,
            user: response.user,
            isAdmin,
            isSuperAdmin
        });
    };

    public logout = async () => {
        // Remove os tokens e limpa o localStorage
        const res = await this.postToAuth("/user/p/logout",null)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresIn");
        localStorage.removeItem("user");

        console.log(res?.data.message);

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
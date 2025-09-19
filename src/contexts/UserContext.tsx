import type User from "../types/User.ts";
import {createContext, type ReactNode} from "react";
import * as React from "react";
import type {BaseState} from "../types/PageTypes.ts";

export interface UserContextProps {
    isLoggedIn: boolean
    isAdmin: boolean
    isSuperAdmin: boolean
    user: User | null
}

type UserContextState = BaseState & UserContextProps

export const UserContext = createContext<UserContextProps>({
    isLoggedIn: false,
    isAdmin: false,
    isSuperAdmin: false,
    user: null
})

export class UserProvider extends React.PureComponent<{children: ReactNode}, UserContextState>{

    state: UserContextState = {
        isLoggedIn: false,
        isAdmin: false,
        isSuperAdmin: false,
        user: null,
        err: null,
        loading: true
    }

    componentDidMount() {
    }

    render() {
        const {isLoggedIn, isAdmin, isSuperAdmin, user, err} = this.state;
        if(err){
            return <React.StrictMode>{err.message};</React.StrictMode>
        }
        return <UserContext.Provider value={{isLoggedIn,isAdmin,isSuperAdmin,user}}>
            {this.props.children}
        </UserContext.Provider>;
    }
}
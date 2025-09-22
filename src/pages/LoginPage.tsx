import BasePage from "./BasePage.tsx";
import type {BaseProps, BaseState} from "../types/PageTypes.ts";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/loginPage.scss"
import {BaseException} from "../exceptions/BaseException.ts";
import {ErrorCode} from "../types/ResponseType.ts";
import {UserException} from "../exceptions/UserException.ts";
import type {AuthResponse, LoginRequest, SendInfo} from "../types/LoginTypes.ts";
import {UserContext} from "../contexts/UserContext.tsx";
import React from "react";

type LoginPageState = BaseState & {
    recaptchaValue: string | null;
    loginValue: string | null;
    password: string | null;
}

class LoginPage extends BasePage<BaseProps, LoginPageState>{

    static contextType = UserContext;
    declare context: React.ContextType<typeof UserContext>

    state: LoginPageState = {
        err: null,
        title: "Login",
        loading: false,
        status: "",
        recaptchaValue: null,
        loginValue: null,
        password: null,
    };

    private async login(){
        try{
            if(!this.state.recaptchaValue){
                throw new UserException("ReCAPTCHA not done");
            }
            if(!this.state.loginValue){
                throw new UserException("Invalid email address or username")
            }
            if(!this.state.password){
                throw new UserException("Invalid password")
            }

            const userInformation: SendInfo = {
                loginValue: this.state.loginValue,
                password: this.state.password,
                fingerprint: (await this.getFingerprint()).visitorId
            }

            const encrypted = await this.encryptData<SendInfo>(userInformation)

            const data:LoginRequest = {
                encryptedInfo: encrypted,
                recaptchaToken: this.state.recaptchaValue,
            }

            const response = await this.postToAuth<AuthResponse, LoginRequest>("/admin/login", data)

            if(response){
                if(this.context && this.context.login){
                    this.context.login(
                        response.data.data
                    );
                }else{
                    throw new BaseException("UNKNOWN_ERROR", "Context login function not available")
                }
                window.location.href = "/home";
            }
        }catch(error: unknown){
            if(error instanceof BaseException){
                this.setState({
                    err:error
                })
            }else{
                this.setState({
                    err: new BaseException(
                        ErrorCode.UNKNOWN_ERROR,
                        (error as Error).message || "An unknown error occurred"
                    )
                })
            }
        }finally {
            this.setState({
                recaptchaValue: null
            })
        }
    }

    protected renderContent() {
        const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
        return (
            <main className="main-login">
                <h1>Login Admin</h1>
                <div>
                    <label htmlFor={"email"}>E-mail/Username</label>
                    <input
                        onChange={(e)=>this.setState({loginValue: e.currentTarget.value})}
                        type="text"
                        name={"email"}
                    />
                </div>
                <div>
                    <label htmlFor={"password"}>Senha</label>
                    <input
                        onChange={(e)=>this.setState({password: e.currentTarget.value})}
                        type="password"
                        name={"password"}
                    />
                </div>
                {/*<div className="captcha-container"/>*/}
                <ReCAPTCHA
                    className="recaptcha"
                    onChange={(e)=>this.setState({recaptchaValue: e})}
                    sitekey={recaptchaKey}
                />
                <button onClick={()=> this.login()} className="login-button">Entrar</button>
            </main>
        );
    }
}
export default LoginPage;
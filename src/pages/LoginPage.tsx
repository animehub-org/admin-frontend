import BasePage from "./BasePage.tsx";
import type { BaseProps, PageState } from "../types/PageTypes.ts";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/loginPage.scss"
import { BaseException } from "../exceptions/BaseException.ts";
import { ErrorCode } from "../types/ResponseType.ts";
import { UserException } from "../exceptions/UserException.ts";
import React from "react";
import AuthService from "../services/AuthService.ts";

type LoginPageState = PageState & {
    recaptchaValue: string | null;
    loginValue: string | null;
    password: string | null;
}

class LoginPage extends BasePage<BaseProps, LoginPageState> {

    state: LoginPageState = {
        err: null,
        title: "Login",
        loading: false,
        recaptchaValue: null,
        loginValue: null,
        password: null,
    };

    private login = async (): Promise<void> => {
        // Validações
        if (!this.state.recaptchaValue) {
            this.setState({ err: new UserException("ReCAPTCHA not done") });
            return;
        }
        if (!this.state.loginValue) {
            this.setState({ err: new UserException("Invalid email address or username") });
            return;
        }
        if (!this.state.password) {
            this.setState({ err: new UserException("Invalid password") });
            return;
        }

        this.setState({ loading: true, err: null });

        try {
            console.log("Iniciando login OAuth2...");
            console.log("Endpoint:", `http://localhost:8080/oauth2/token`);

            // Chama diretamente o AuthService (OAuth2)
            const tokenResponse = await AuthService.login(
                this.state.loginValue,
                this.state.password
            );

            console.log("Login bem sucedido!", tokenResponse);
            console.log("Access Token salvo:", AuthService.getAccessToken());

            // Verifica se tem role de admin
            const hasAdminRole = AuthService.hasRole("ROLE_ADMIN");
            console.log("Has admin role:", hasAdminRole);

            if (!hasAdminRole) {
                AuthService.logout();
                throw new Error("Você não tem permissão de administrador");
            }

            // Redireciona para home
            window.location.href = "/home";

        } catch (error: unknown) {
            console.error("Erro no login:", error);

            if (error instanceof BaseException) {
                this.setState({ err: error });
            } else {
                this.setState({
                    err: new BaseException(
                        ErrorCode.UNKNOWN_ERROR,
                        (error as Error).message || "An unknown error occurred"
                    )
                });
            }
        } finally {
            this.setState({
                recaptchaValue: null,
                loading: false
            });
        }
    };

    private handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        this.login();
    };

    protected renderContent() {
        const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
        return (
            <main className="main-login">
                <h1>Login Admin</h1>

                {/* Mostra erro se houver */}
                {this.state.err && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '1rem', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
                        {this.state.err.message}
                    </div>
                )}

                <div>
                    <label htmlFor={"email"}>E-mail/Username</label>
                    <input
                        onChange={(e) => this.setState({ loginValue: e.currentTarget.value })}
                        type="text"
                        name={"email"}
                        disabled={this.state.loading}
                    />
                </div>
                <div>
                    <label htmlFor={"password"}>Senha</label>
                    <input
                        onChange={(e) => this.setState({ password: e.currentTarget.value })}
                        type="password"
                        name={"password"}
                        disabled={this.state.loading}
                    />
                </div>
                <ReCAPTCHA
                    className="recaptcha"
                    onChange={(e) => this.setState({ recaptchaValue: e })}
                    sitekey={recaptchaKey}
                />
                <button
                    onClick={this.handleLoginClick}
                    className="login-button"
                    disabled={this.state.loading}
                >
                    {this.state.loading ? "Entrando..." : "Entrar"}
                </button>
            </main>
        );
    }
}
export default LoginPage;
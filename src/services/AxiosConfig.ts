import axios from "axios";
import AuthService from "./AuthService";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const setupAxiosInterceptors = () => {
    // Request interceptor para adicionar o token
    axios.interceptors.request.use(
        (config) => {
            const token = AuthService.getAccessToken();
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor para tratar 401
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // Se o erro for 401 e não for uma tentativa de login ou refresh
            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest._retry &&
                !originalRequest.url?.includes("/oauth2/token") &&
                !originalRequest.url?.includes("/login")
            ) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                            return axios(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const newTokenResponse = await AuthService.refreshToken();

                    if (newTokenResponse) {
                        isRefreshing = false;
                        processQueue(null, newTokenResponse.access_token);
                        originalRequest.headers["Authorization"] = `Bearer ${newTokenResponse.access_token}`;
                        return axios(originalRequest);
                    } else {
                        // Refresh falhou - logout
                        isRefreshing = false;
                        processQueue(new Error("Refresh failed"), null);
                        AuthService.logout();
                        window.location.href = "/login";
                        return Promise.reject(error);
                    }

                } catch (err) {
                    isRefreshing = false;
                    processQueue(err, null);
                    AuthService.logout();
                    window.location.href = "/login";
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );
};

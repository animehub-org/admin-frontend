export type LoginRequest = {
    encryptedInfo: string,
    recaptchaToken: string
}

export type SendInfo = {
    loginValue: string,
    password?: string,
    fingerprint?: string,
}

export type AuthResponse = {
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
}
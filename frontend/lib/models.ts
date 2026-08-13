export type ServerResponse<T> = {
    success: boolean
    message: string
    status: number
    errorCode?: string
    timestamp?: string
    content?: T
}

export type RefreshTokenResponse = {
    accessToken: string
    refreshToken: string
}
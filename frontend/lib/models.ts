type ServerResponse<T> = {
    message: string
    status: number
    errorCode?: string
    timestamp?: string
    content?: T
}
export type SignInRequest = {
    email: string;
    password: string;
}

export type SignInResponse = {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export type User = {
    id: string;
    email: string;
}
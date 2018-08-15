export interface AuthSuccess {
    token: string;
}

export interface AuthError {
    message: string;
    code: number;
}

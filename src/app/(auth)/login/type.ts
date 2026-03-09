export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data : {
        token: string;
        user: {
            id: number
            name: string
            username: string
            email: string
            phone: string
            avatarUrl: string
        }
    }
}
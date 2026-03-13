import { User } from "../../user/user-modal";

export interface LoginResponse {
    token: string,
    user: User
}
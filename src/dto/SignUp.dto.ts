import { DTO } from "./dto"

class SignUpDTO implements DTO {
    userName: string
    userEmail: string
    password: string
    passwordVerify: string
}

export { SignUpDTO }
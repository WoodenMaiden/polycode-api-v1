import { DTO } from "./dto"

class SignUpDTO extends DTO {
    userName: string = ""
    userEmail: string = ""
    password: string = ""
    passwordVerify: string = ""
}

export { SignUpDTO }
import { DTO } from "./dto"

class AnswerDTO extends DTO {
    language: string = ""
    inputs: string[] = [""]
    expectedOutputs: string[] = [""]

    submitted: string = "" 
}

export { AnswerDTO }
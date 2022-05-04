import { DTO } from "./dto"

class ExerciseDTO extends DTO {
    language: string = ""
    title: string = ""
    statement: string = ""
    relatedCourse: string = ""
    inputs: string[] = [""]
    expectedOutputs: string[] = [""]

    keyWords: string[] = [""]
    initialCode: string = ""
}

export { ExerciseDTO }
import { DTO } from "./dto"

class CourseInfo 
{
    courseName : string = ""
    courseDescription: string = ""
    exerciseNumber: number = 0
}


class ExerciseDTO extends DTO {
    language: string = ""
    title: string = ""
    statement: string = ""
    relatedCourse: CourseInfo
    inputs: string[] = [""]
    expectedOutputs: string[] = [""]

    keyWords: string[] = [""]
    initialCode: string = ""
}

export { ExerciseDTO }
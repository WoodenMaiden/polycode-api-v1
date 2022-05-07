import { Response, Request, NextFunction } from "express";
import { DTO, LoginDTO, SignUpDTO, PatchDTO, ExerciseDTO, AnswerDTO } from '../dto'


const DTOs: Map<string, DTO> = new Map<string, DTO>([
    ["POST;user", new SignUpDTO()],
    ["PATCH;user", new PatchDTO()],
    ["GET;login", new LoginDTO()],
    ["POST;exercise", new ExerciseDTO()],
    ["GET;answer", new AnswerDTO()]
])


export function checkDTO(req: Request, res: Response, next: NextFunction) {
    const REGEX = /"\w+":/ig
    const input = req.body
    const identifiedDTO: DTO = (req.url === '/')
        ? DTOs.get(req.method + ';')
        : DTOs.get(req.method + ";" +  req.url.split('/')[1])
    
    if (!identifiedDTO) res.status(400).send({
        message: "Invalid route"
    })
    else {
        const DTOFields: string[] = JSON.stringify(identifiedDTO).match(REGEX);
        const strInputFields: string[] = JSON.stringify(input).match(REGEX);

        const compareArr: string[] = DTOFields.filter(entry => !strInputFields.includes(entry));
        if (compareArr.length === 0) next()
        else {
            res.status(400).send({
               message: "Invalid body"
            })
        }
    }
}
import { Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";


export class ErrorService {

    constructor() {}

    respond(error: unknown, res: Response) {
        
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`)
        return res.status(500).json({ error: 'Internal server error' });
    }

}
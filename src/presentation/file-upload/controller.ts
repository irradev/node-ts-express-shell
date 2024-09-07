import { Request, Response } from 'express';
import { ErrorService } from "../services/error.service";
import { FileUploadService } from '../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';


export class FileUploadController {

    constructor(
       public readonly errorService: ErrorService,
       public readonly fileUploadService: FileUploadService
    ) {}

    uploadFile = (req: Request, res: Response) => {
        const file = req.body.files.at(0) as UploadedFile;

        this.fileUploadService
            .uploadSingleFile(file,  req.params.type)
            .then(file => res.status(200).json(file))
            .catch(error => this.errorService.respond(error, res));

    }

    uploadMultipleFiles = (req: Request, res: Response) => {
        const files = req.body.files as UploadedFile[];

        this.fileUploadService
            .uploadMultipleFile(files, req.params.type)
            .then(file => res.status(200).json(file))
            .catch(error => this.errorService.respond(error, res));

    }

}
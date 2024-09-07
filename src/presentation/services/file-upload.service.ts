import path from 'path';
import fs from 'fs';
import type { UploadedFile } from "express-fileupload";
import { UuidPlugin } from '../../config/plugins/uuid.plugin';
import { CustomError } from '../../domain/errors/custom.error';


export class FileUploadService {

    constructor(
        private readonly uuid = UuidPlugin.v4
    ) {}

    private checkFolder(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    }

    async uploadSingleFile(
        file: UploadedFile, 
        folder: string = 'demo',
        validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'webp'],

    ) {

        try {
            const fileExtension = file.mimetype.split('/').at(1) || '';
            if (!validExtensions.includes(fileExtension)) {
                throw CustomError.badRequest(
                    `Invalid file extension: ${fileExtension}, valid ones are: ${validExtensions}`
                );
            } 

            const destination = path.resolve(__dirname, '../../../uploads/', folder);
            this.checkFolder(destination);

            const fileName = `${this.uuid()}.${fileExtension}`

            file.mv(`${destination}/${fileName}`);

            return { fileName };
            
        } catch (error) {
            // console.log(error);
            throw error;
        }
    }
    
    async uploadMultipleFile( 
        files: UploadedFile[], 
        folder: string = 'uploads',
        validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    ) {
        const fileNames = await Promise.all(
            files.map(file => this.uploadSingleFile(file, folder, validExtensions))
        );

        return fileNames;
    }
}
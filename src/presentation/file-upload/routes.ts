import { Router } from "express";
import { FileUploadController } from "./controller";
import { ErrorService } from '../services/error.service';
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";


export class FileUploadRoutes {

    static get routes(): Router {

        const router = Router();
    
        const errorService = new ErrorService();
        const fileUploadService = new FileUploadService();
        const controller = new FileUploadController(errorService, fileUploadService);
        
        router.use([
            AuthMiddleware.validateJwt,
            FileUploadMiddleware.containFiles, 
            TypeMiddleware.validTypes(['users', 'products', 'categories']),
        ]);

        router.post( '/single/:type', controller.uploadFile );
        router.post( '/multiple/:type', controller.uploadMultipleFiles );

        return router;

    }


}
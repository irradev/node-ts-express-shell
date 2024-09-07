import { Router } from "express";
import { CategoryController } from "./controller";
import { ErrorService } from '../services/error.service';
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from '../services/category.service';


export class CategoryRoutes {

    static get routes(): Router {

        const router = Router();
    
        const errorService = new ErrorService();
        const categoryService = new CategoryService();
        const controller = new CategoryController(errorService, categoryService);
        

        router.get( '/', controller.getCategories );
        router.post( '/', [ AuthMiddleware.validateJwt ], controller.createCategory );

        return router;

    }


}
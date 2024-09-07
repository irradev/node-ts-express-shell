import { Router } from "express";
import { ProductController } from "./controller";
import { ErrorService } from '../services/error.service';
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProductService } from "../services/product.service";


export class ProductRoutes {

    static get routes(): Router {

        const router = Router();

        const errorService = new ErrorService();
        const productService = new ProductService();
        const controller = new ProductController(errorService, productService);

        router.get( '/', controller.getProducts );
        router.post( '/', [ AuthMiddleware.validateJwt ], controller.createProduct );

        return router;
    }
}
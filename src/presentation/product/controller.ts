import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { ErrorService } from "../services/error.service";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { CreateProductDto } from "../../domain/dtos/products/product.dto";
import { ProductService } from '../services/product.service';


export class ProductController {

    constructor(
        private readonly errorService: ErrorService,
        private readonly productService: ProductService,
    ) {}


    createProduct = (req: Request, res: Response) => {

        const [error, createProductDto] = CreateProductDto.create({ ...req.body, userId: req.body.user?.id });
        if (error) return res.status(400).json({ error });
       
        return this.productService.createProduct(createProductDto!)
            .then(product => res.status(201).json(product))
            .catch(error => this.errorService.respond(error, res));
    }

    getProducts = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        return this.productService.getProducts(paginationDto!)
            .then(products => res.status(200).json(products))
            .catch(error => this.errorService.respond(error, res));

    }
}
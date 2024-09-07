import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { ErrorService } from '../services/error.service';
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryService } from "../services/category.service";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";


export class CategoryController {

    constructor(
       public readonly errorService: ErrorService,
       public readonly categoryService: CategoryService
    ) {}

    createCategory = (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
        if (error) return res.status(400).json({ error });

        const user = req.body.user;
        if (!user) return res.status(500).json({ error: 'Internal server error' });

        return this.categoryService.createCategory(createCategoryDto!, user)
            .then(category => res.status(201).json(category))
            .catch(error => this.errorService.respond(error, res));
    }

    getCategories = (req: Request, res: Response) => {

        const {page = 1, limit = 10} = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);

        if (error) return res.status(400).json({ error });

        return this.categoryService.getCategories(paginationDto!)
            .then(categories => res.status(200).json(categories))
            .catch(error => this.errorService.respond(error, res));
    }

}
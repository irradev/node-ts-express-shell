import { CategoryModel } from "../../data/mongo/models/category.model";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";


export class CategoryService {

    constructor() { }

    async createCategory(category: CreateCategoryDto, user: UserEntity) {

        const isCategoryExists = await CategoryModel.findOne({ name: category.name });
        if (isCategoryExists) throw CustomError.badRequest('Category already exists');

        try {
            const newCategory = await CategoryModel.create({
                ...category,
                user: user.id
            });
    
            await newCategory.save();
    
            return {
                id: newCategory.id,
                name: newCategory.name,
                available: newCategory.available,
            };
            
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Internal server error');
        }
    }

    async getCategories(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;
        

        try {

            // Para que las consultas funcionen en paralelo y no bloquee una a la otra
            const [total, categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);

            // const total = await CategoryModel.countDocuments();
            // const categories = await CategoryModel.find()
            //     .skip((page - 1) * limit)
            //     .limit(limit);

            const totalPages = Math.ceil(total / limit);
            let nextPage: string | null = null;
            let prevPage: string | null = null;

            if (page + 1 <= totalPages) nextPage = `/api/categories?page=${page + 1}&limit=${limit}`;
            if (page - 1 > 0) prevPage = `/api/categories?page=${page - 1}&limit=${limit}`;
            if (page > totalPages) prevPage = `/api/categories?page=${totalPages}&limit=${limit}`;

            
            return {
                page: page,
                limit: limit,
                total: total,
                pages: totalPages,
                next: nextPage,
                prev: prevPage,
                categories: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available
                }))
            };

        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Internal server error');
        }
    }
}
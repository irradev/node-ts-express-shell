import { CategoryModel } from '../../data/mongo/models/category.model';
import { ProductModel } from '../../data/mongo/models/product.model';
import { UserModel } from '../../data/mongo/models/user.model';
import { CreateProductDto } from '../../domain/dtos/products/product.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';


export class ProductService {

    constructor() {}

    async createProduct(createProductDto: CreateProductDto) {
        const isUserExists = await UserModel.findById({ _id: createProductDto.userId });
        if (!isUserExists) throw CustomError.internalServer('User not found');

        const isProductExists = await ProductModel.findOne({ name: createProductDto.name });
        if (isProductExists) throw CustomError.badRequest('Product already exists');

        const isCategoryExists = await CategoryModel.findById({ _id: createProductDto.categoryId });
        if (!isCategoryExists) throw CustomError.badRequest('Category not found');

        try {
            const { userId: user, categoryId: category, ...productData } = createProductDto;
            const newPrdouct = await ProductModel.create({
                ...productData,
                user,
                category
            });

            await newPrdouct.save();

            return newPrdouct;

        } catch (error) {
            
        }

    }

    async getProducts(paginationDto: PaginationDto) {

        const { page = 1, limit = 10 } = paginationDto;
        try {

            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')
            ]);

            const totalPages = Math.ceil(total / limit);
            let nextPage: string | null = null;
            let prevPage: string | null = null;

            if (page < totalPages) {
                nextPage = `http://localhost:3000/products?page=${page + 1}&limit=${limit}`;
            }

            if (page > 1) {
                prevPage = `http://localhost:3000/products?page=${page - 1}&limit=${limit}`;
            }

            return {
                page: page,
                limit: limit,
                total: total,
                pages: totalPages,
                next: nextPage,
                prev: prevPage,
                products: products
            };
            
        } catch (error) {
            throw CustomError.internalServer('Error getting products');
        }
    }
}
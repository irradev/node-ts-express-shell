import { Validators } from "../../../config/helpers/validators";


export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly userId: string, // ID
        public readonly categoryId: string, // ID
    ) {}

    static create(object: Record<string, any>): [string?, CreateProductDto?] {

        const {
            name,
            available = false,
            price,
            description,
            categoryId,
            userId,
        } = object;

        let avialableBoolean: boolean = available;
        if (typeof available !== 'boolean') {
            avialableBoolean = Boolean(available);
        };

        if (!name) return ['Name is required'];
        if (!price) return ['Price is required'];
        if (!description) return ['Description is required'];
        if (!userId) return ['User ID is required'];
        if (!Validators.isMongoID(userId)) return ['Invalid user ID'];
        if (!categoryId) return ['Category ID is required'];
        if (!Validators.isMongoID(categoryId)) return ['Invalid user ID'];

        return [undefined, new CreateProductDto(name, avialableBoolean, price, description, userId, categoryId)];
    }
}
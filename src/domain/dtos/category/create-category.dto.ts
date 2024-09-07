export class CreateCategoryDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
    ) {}

    static create (object: Record<string, any>): [string?, CreateCategoryDto?] {
        const { name, available = false } = object;

        let avialableBoolean: boolean = available;

        if (!name) return ['name is required'];
        if (typeof available !== 'boolean') {
            avialableBoolean = Boolean(available);
        };

        return [undefined, new CreateCategoryDto(name, avialableBoolean)];
    }

}
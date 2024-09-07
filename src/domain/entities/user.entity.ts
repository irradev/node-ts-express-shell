import { CustomError } from "../errors/custom.error";


export class UserEntity {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly emailValidated: boolean,
        public readonly password: string,
        public readonly roles: string[],
        public readonly avatar?: string,
    ){}

    static fromObject(object: Record<string, any>) {
        const {
            id,
            _id,
            name,
            email,
            emailValidated,
            password,
            roles,
            avatar
        } = object;

        if (!id && !_id) {
            throw CustomError.badRequest('Missing id');
        }

        if (!name) {
            throw CustomError.badRequest('Missing name');
        }

        if (!email) {
            throw CustomError.badRequest('Missing email');
        }
        
        if (emailValidated === undefined) {
            throw CustomError.badRequest('Missing emailValidated');
        }

        if (!password) {
            throw CustomError.badRequest('Missing password');
        }

        if (!roles || roles.length === 0) {
            throw CustomError.badRequest('Missing roles');
        }

        return new UserEntity(id || _id, name, email, emailValidated, password, roles, avatar);

    }
}
import bcrypt from 'bcryptjs';

// Esta es otra forma de hacerlo pero se puede seguir la homogeneidad de classes
export const bcryptPlugin = {

    hash: (password: string): string => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        return hash;
    },

    compare: (password: string, hashed: string): boolean => {
        return bcrypt.compareSync(password, hashed);
    }
}
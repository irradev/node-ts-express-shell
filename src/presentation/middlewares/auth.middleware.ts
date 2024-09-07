import { NextFunction, Request, Response } from "express";
import { JwtPlugin } from "../../config/plugins/jwt.plugin";
import { UserModel } from "../../data/mongo/models/user.model";
import { UserEntity } from "../../domain/entities/user.entity";


export class AuthMiddleware {


    static async validateJwt(req: Request, res: Response, next: NextFunction) {

        const unauthorizeResponse = (message = 'Unauthorized') => {
            return res.status(401).json({ error: message });
        }

        const authorization = req.header('Authorization');
        if (!authorization) return unauthorizeResponse();
        if (!authorization.startsWith('Bearer ')) return unauthorizeResponse();
        const token = authorization.split(' ').at(1) || '';
        if (!token) return unauthorizeResponse();

        try {

            const payload = await JwtPlugin.validateToken<{id: string}>(token);
            if (!payload) return unauthorizeResponse('Invalid token');
            if (!payload.id) return unauthorizeResponse('Invalid token');

            const user = await UserModel.findById(payload.id);
            if (!user) return unauthorizeResponse('Invalid token');

            // Todo: validar si el usuario está activo

            req.body.user = UserEntity.fromObject(user);

            next();
            
        } catch (error) {
            console.log(error); // usar winstone
            res.status(500).json({ error: 'Internal server error' });
        }


    }
}
import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { AuthService } from "../services/auth.service";
import { CustomError } from "../../domain/errors/custom.error";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { ErrorService } from "../services/error.service";



export class AuthController {

    constructor(
        public readonly authService: AuthService,
        public readonly errorService: ErrorService
    ) {}

    registerUser = (req: Request, res: Response) => {

        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        return this.authService.registerUser(registerUserDto!)
            .then(user => res.status(201).json(user))
            .catch(error => this.errorService.respond(error, res));

    }

    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        return this.authService.loginUser(loginUserDto!)
            .then(user => res.status(200).json(user))
            .catch(error => this.errorService.respond(error, res));

    }

    validateEmail = (req: Request, res: Response) => {
        const { token } = req.params;
        return this.authService.validateEmail(token)
            .then(() => res.status(200).json({ message: 'Email validated successfully' }))
            .catch(error => this.errorService.respond(error, res));
    }

}
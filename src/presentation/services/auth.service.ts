import { UserModel } from '../../data/mongo/models/user.model';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { UserEntity } from '../../domain/entities/user.entity';
import { bcryptPlugin } from '../../config/plugins/bcrypt.plugin';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { JwtPlugin } from '../../config/plugins/jwt.plugin';
import { EmailService } from './email.service';
import { envs } from '../../config/envs';


export class AuthService {

    // DI
    constructor(
        private readonly emailService: EmailService
    ) {}

    public async registerUser(registerUserDto: RegisterUserDto) {

        const isUserExists = await UserModel.findOne({ email: registerUserDto.email });
        if (isUserExists) throw CustomError.badRequest('Email already exists');

        const user = new UserModel(registerUserDto);
        
        // Encriptar la contraseña
        user.password = bcryptPlugin.hash(user.password);

        await user.save();
        
        // JWT <--- para mantener la autenticación del usuario
        const token = await JwtPlugin.generateToken({ id: user.id });
        if (!token) throw 'Error generating JWT';

        // Enviar un email de confirmación
        await this.sendEmailValidationLink(user.email);

        const {password, ...userEntity} = UserEntity.fromObject(user);

        return {
            user: userEntity,
            token: token,
        };
        
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        
        const isUserExists = await UserModel.findOne({ email: loginUserDto.email });
        if (!isUserExists) throw CustomError.badRequest('Invalid credentials');

        // Verificar la contraseña
        const isMatch = bcryptPlugin.compare(loginUserDto.password, isUserExists.password);
        if (!isMatch) throw CustomError.badRequest('Invalid credentials');

        const token = await JwtPlugin.generateToken({id: isUserExists.id });
        if (!token) throw CustomError.internalServer('Error generating JWT');
            
        const {password, ...userEntity} = UserEntity.fromObject(isUserExists);

        return {
            user: userEntity,
            token: token,
        };

    }

    public async validateEmail(token: string) {
        if (!token) throw CustomError.badRequest('Invalid token');
        
        const payload = await JwtPlugin.validateToken(token);
        if (!payload) throw CustomError.unauthorized('Token has expired');

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.notFound('Email not exists');

        user.emailValidated = true;
        await user.save();
        
        return true;

    }

    private async sendEmailValidationLink(email: string) {

        const token = await JwtPlugin.generateToken({ email }, '15m');
        if (!token) throw CustomError.internalServer('Error generating JWT for email validation');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the link below to validate your email</p>
            <a href="${link}">Validate your email: ${ email }</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        };

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer('Error sending email');

        return true;

    }

}
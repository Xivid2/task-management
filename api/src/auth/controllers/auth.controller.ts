import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { ValidationPipe } from '@nestjs/common/pipes';
import { SignInPayload } from '../interfaces/sign-in-payload.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) authCredentials: AuthCredentialsDto
    ): Promise<void> {
        return this.authService.signUp(authCredentials);
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe) authCredentials: AuthCredentialsDto
    ): Promise<SignInPayload> {
        return this.authService.signin(authCredentials);
    }
}

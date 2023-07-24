import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SignInPayload } from '../interfaces/sign-in-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();

        const user = new User();
        user.username = username;
        user.password = await this.hashPassword(password, salt);

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException();
            }

            throw new InternalServerErrorException();
        }
    }

    async signin(authCredentialsDto: AuthCredentialsDto): Promise<SignInPayload> {
        const { username, password } = authCredentialsDto;

        const user = await this.userRepository.findOneBy({ username });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isSamePassword = await user.validatePassword(password);

        if (isSamePassword) {
            const payload: JwtPayload = { username: user.username };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        }

        throw new UnauthorizedException('Invalid credentials');
    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}

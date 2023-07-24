import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password: string;
};
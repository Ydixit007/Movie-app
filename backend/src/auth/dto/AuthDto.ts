import { IsString, MinLength } from 'class-validator';

export class AuthUserDTO {
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    username: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}

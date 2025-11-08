import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import bcrypt from "bcrypt"
import { AuthUserDTO } from './dto/AuthDto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    // register user service.
    async registerUser(registerUserDTO: AuthUserDTO) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(registerUserDTO.password, saltRounds);

        const user = await this.userService.createUser({ ...registerUserDTO, password: hash });

        const token = await this.jwtService.signAsync({ sub: user._id })

        return token;
    }

    // user login service
    async loginUser(loginUserDTO: AuthUserDTO) {
        const user = await this.userService.getUser(loginUserDTO.username);
        const isAuth = await bcrypt.compare(loginUserDTO.password, user.password);

        if (!isAuth) {
            throw new UnauthorizedException('Incorrect Password');
        }

        const token = await this.jwtService.signAsync({ sub: user.id });

        return token;
    }
}

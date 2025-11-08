import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDTO } from './dto/AuthDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // signup route.
    @Post("signup")
    async registerUser(@Body() registerUserDto: AuthUserDTO) {
        const token = await this.authService.registerUser(registerUserDto);

        return { access_token: token, success: true };
    }

    // login route
    @Post('login')
    async loginUser(@Body() loginUserDTO: AuthUserDTO) {
        const token = await this.authService.loginUser(loginUserDTO);
        return { access_token: token, success: true };
    }
}

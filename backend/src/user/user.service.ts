import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { AuthUserDTO } from 'src/auth/dto/AuthDto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<User>) { }

    // service to create a user in the db.
    async createUser(registerUserDTO: AuthUserDTO) {
        try {
            return await this.UserModel.create({
                username: registerUserDTO.username,
                password: registerUserDTO.password,
            });
        } catch (error) {
            console.log(error.code);

            if (error.code === 11000) {
                throw new ConflictException('Username Already Exists');
            }

            throw error;
        }
    }

    // service to get user from db.
    async getUser(username: string) {
        try {
            const user = await this.UserModel.findOne({ username });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
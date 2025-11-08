import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Movie {
    @Prop({ required: true, trim: true, minlength: 3, unique: true })
    movieName: string;

    @Prop({ required: true })
    publishDate: Date;

    @Prop({ required: true })
    cover: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: User;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
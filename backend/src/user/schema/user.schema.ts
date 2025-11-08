import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    @Prop({ required: true, minlength: 3, unique: true, trim: true })
    username: string;

    @Prop({ required: true, minlength: 8 })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
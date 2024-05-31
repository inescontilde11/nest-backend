import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Game } from "src/app/entities/game.entity";

@Schema()
export class User {
    _id?: string;

    @Prop({ unique: true, required: true})
    username: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ minlength: 6, required: true})
    pwd?: string;

    @Prop({ required: false })
    tfno: string | undefined;

    @Prop({ maxlength: 500})
    desc: string | undefined;

    @Prop({ required: false })
    img?: string | undefined;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ required: true })
    role: string;

    @Prop({ default: [], required: false })
    games: Game[] | undefined;
}

export const UserSchema = SchemaFactory.createForClass(User);

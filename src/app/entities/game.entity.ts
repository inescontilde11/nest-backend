import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DateExpressionOperatorReturningString } from "mongoose";

@Schema()
export class Game {
    _id?: string;

    @Prop({ unique: true, required: true})
    title: string;

    @Prop({ required: true })
    devname: string;

    @Prop({ maxlength: 500, required: true})
    desc: string;

    @Prop({ type: [String], required: true })
    categories: string[];

    shortvideo?: string;

    @Prop({ type: [String], required: true })
    imgs: string[];

    @Prop({ required: true })
    releasedate: string

    @Prop({ required: true })
    archiveexegame: string;

    tamanyo?: number;
}

export const GameSchema = SchemaFactory.createForClass(Game);
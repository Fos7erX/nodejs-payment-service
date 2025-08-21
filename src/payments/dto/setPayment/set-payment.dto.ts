import { IsDate, IsNumber, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Payer } from "./payer/payer.dto";
import { Type } from "@nestjs/class-transformer";
import { ValidateNested } from "class-validator";

export class SetPaymentDto{
    @IsString()
    @ApiProperty({
        example:"1"
    })
    description:string;
    
    @IsDate()
    @Type(() => Date)
    @ApiProperty({
        example:'2025-08-20'
    })
    due_date:Date;

    @IsNumber()
    @ApiProperty({
        example: 20099,
    })
    amount_cents:number;

    @IsString()
    @ApiProperty({
        example: 'USD|ARS'
    })
    currency:string;

    @ValidateNested()
    @ApiProperty({
        type:() => Payer
    })
    @Type(() => Payer)
    payer:Payer;
}
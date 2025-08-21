import { IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Payer{

    @IsString()
    @ApiProperty({
        example:'John'
    })
    name:string;

    @IsString()
    @ApiProperty({
        example:'john-doe@outlook.com'
    })
    email:string;
}
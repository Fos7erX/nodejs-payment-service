import { IsString, IsUUID } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SetPaymentEntityResponse{

    @IsUUID()
    @ApiProperty({
        example:'00000000-0000-0000-0000-000000000000'
    })
    payment_id: number;

    @IsString()
    @ApiProperty({
        example:'pending'
    })
    status:string;

    @IsString()
    @ApiProperty({
        example: `https://sandbox.hibe.local/checkout/1`
    })
    checkout_url:string;

}
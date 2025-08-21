import { IsNumber, IsOptional, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetPaymentDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        enum: ['pending', 'paid', 'reversed'],
        required: false
    })
    status?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        minimum: 1,
        example: 20,
        required: false
    })
    limit?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: '3',
        required: false
    })
    cursor?: string;
}

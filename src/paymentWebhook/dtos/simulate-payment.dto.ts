import { IsUUID, IsIn, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SimulatePaymentDto {
    @IsNumber()
    @ApiProperty({ example: 1 })
    payment_id: number;

    @IsIn(['paid', 'reversed'])
    @ApiProperty({ enum: ['paid', 'reversed'] })
    new_status: 'paid' | 'reversed';

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Manually reversed for refund' })
    reason?: string;
}

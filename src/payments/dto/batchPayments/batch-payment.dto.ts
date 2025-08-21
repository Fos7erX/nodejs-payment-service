import { ArrayMaxSize, IsArray, IsString, ValidateNested } from "class-validator";
import { SetPaymentDto } from "../setPayment/set-payment.dto";
import { Type } from "class-transformer";

export class BatchPaymentsDto{
 
    @IsString()
    batchId:string;

    @IsArray()
    @ArrayMaxSize(100)
    @ValidateNested({each:true})
    @Type(() => SetPaymentDto)
    payments: SetPaymentDto[];

}
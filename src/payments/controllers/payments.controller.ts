import { Body, Controller, Get, Headers, Post, Query, UseGuards } from '@nestjs/common';
import { SetPaymentDto } from '../dto/setPayment/set-payment.dto';
import { PaymentsService } from '../services/payments.service';
import { GetPaymentDto } from '../dto/getPayment/get-payment.dto';
import { PaymentTokenAuth } from 'src/paymentWebhook/auth/payment-token-auth.guard';
import { SimulatePaymentDto } from 'src/paymentWebhook/dtos/simulate-payment.dto';
import { BatchPaymentsDto } from '../dto/batchPayments/batch-payment.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('v1')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('payments')
    async setPayment(@Body() paymentBody: SetPaymentDto,
        @Headers('Idempotency-Key') idempotencyKey: number
    ) {
        return this.paymentsService.setPayment(paymentBody, idempotencyKey);
    }

    @Get('payments')
    async getPayment(@Query() params: GetPaymentDto) {
        return await this.paymentsService.getPayment(params);
    }

    @Post('webhooks/simulate')
    @UseGuards(PaymentTokenAuth)
    async simulatePayment(@Body() body: SimulatePaymentDto) {
        return await this.paymentsService.simulatePayment(body)
    }

    @Post('payments/batch')
    @ApiOperation({ summary: 'Submit batch payments (max 100)' })
    @ApiBody({ type: BatchPaymentsDto })
    async setBatchPayments(@Body() body: BatchPaymentsDto) {
        return this.paymentsService.setBatchPayments(body)
    }
}

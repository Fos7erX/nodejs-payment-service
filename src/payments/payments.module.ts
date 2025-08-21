import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { IdempotencyKey } from 'src/idempotencyKey/idempotency-key.entity';
import { PaymentHistory } from 'src/paymentWebhook/payment-history.entity';
import { PaymentTokenAuth } from 'src/paymentWebhook/auth/payment-token-auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, IdempotencyKey, PaymentHistory]), ConfigModule],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymentTokenAuth],
})
export class PaymentsModule { }

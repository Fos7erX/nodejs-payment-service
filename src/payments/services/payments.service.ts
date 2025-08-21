import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SetPaymentDto } from '../dto/setPayment/set-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Payment } from '../payment.entity';
import { SetPaymentEntityResponse } from '../responses/set-payment.response';
import { GetPaymentDto } from '../dto/getPayment/get-payment.dto';
import { IdempotencyKey } from 'src/idempotencyKey/idempotency-key.entity';
import { SimulatePaymentDto } from 'src/paymentWebhook/dtos/simulate-payment.dto';
import { PaymentHistory } from 'src/paymentWebhook/payment-history.entity';
import { BatchPaymentsDto } from '../dto/batchPayments/batch-payment.dto';
import { paymentsQueue } from '../queue/payments.queue';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(IdempotencyKey)
        private idempotencyRepository: Repository<IdempotencyKey>,
        @InjectRepository(PaymentHistory)
        private paymentHistoryRepository: Repository<PaymentHistory>
    ) { }



    async setPayment(body: SetPaymentDto, idempotencyKey: any): Promise<SetPaymentEntityResponse> {
        try {

            const idemKey = await this.idempotencyRepository.findOne({ where: { key: idempotencyKey } })
            if (idemKey) {
                return idemKey.response;
            }

            const payment = new Payment()
            payment.description = body.description;
            payment.due_date = body.due_date;
            payment.amount_cents = body.amount_cents;
            payment.currency = body.currency;
            payment.payer = body.payer;
            payment.status = 'pending';

            const savedPayment = await this.paymentsRepository.save(payment);

            const response: SetPaymentEntityResponse = {
                payment_id: (await savedPayment).id,
                status: 'pending',
                checkout_url: `https://sandbox.hibe.local/checkout/${(await savedPayment).id}`,
            };

            const keyEntity = this.idempotencyRepository.create({
                key: idempotencyKey,
                response,
            });

            await this.idempotencyRepository.save(keyEntity);
            return response;

        } catch (error) {
            console.log("Error in service: ", error)
            throw new HttpException('There was an error trying to set a new payment', HttpStatus.BAD_REQUEST, error)
        }
    }

    async getPayment(params: GetPaymentDto): Promise<{ items: Payment[], next_cursor?: number | null }> {
        try {
            const where: any = {};

            if (params.status) {
                where.status = params.status;
            }

            if (params.cursor) {
                where.id = MoreThan(Number(params.cursor));
            }

            const limit = params.limit ?? 20;

            const payments = await this.paymentsRepository.find({
                where,
                order: { id: 'ASC' },
                take: limit,
            });

            let next_cursor: number | null = null;
            if (payments.length === limit) {
                next_cursor = payments[payments.length - 1].id;
            }

            return {
                items: payments,
                next_cursor,
            };

        } catch (error) {
            throw new HttpException(
                'There was an error trying to get payments',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async simulatePayment(body: SimulatePaymentDto): Promise<any> {
        const payment = await this.paymentsRepository.findOne({ where: { id: body.payment_id } })

        if (!payment) {
            throw new HttpException('Payment not found!', HttpStatus.NOT_FOUND)
        }

        const validTransitions = {
            pending: ['paid'],
            paid: ['reversed']
        }

        const currentPaymentStatus = payment.status;
        const nextStatus = body.new_status;

        if (!validTransitions[currentPaymentStatus] ||
            !validTransitions[currentPaymentStatus].includes(nextStatus)) {
            throw new HttpException('Invalid status transition', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        payment.status = nextStatus;
        await this.paymentsRepository.save(payment);

        const paymentHistory = this.paymentHistoryRepository.create({
            payment,
            fromStatus: currentPaymentStatus,
            toStatus: nextStatus,
            reason: body.reason,
        })

        await this.paymentHistoryRepository.save(paymentHistory)

        return {
            message: 'Status updated',
            payment_id: payment.id,
            new_status: nextStatus
        }

    }

    async setBatchPayments(body: BatchPaymentsDto): Promise<any> {

        const { payments, batchId } = body;

        const existingProcess = await paymentsQueue.getJob(batchId);
        if (existingProcess) {
            return {
                message: 'Batch already submitted',
            };
        }

        const jobs = payments.map((p, index) => ({
            name: `payment-${index}`,
            data: { ...p, index },
            opts: {
                attempts: 3,
                backoff: {
                    type: 'fixed',
                    delay: parseInt(process.env.RETRY_DELAY_MS || '1000', 10)
                },
            }
        }))

        await paymentsQueue.addBulk(jobs);

        return{
            message: 'Batch accepted',
            total:payments.length,
        }

    }

}
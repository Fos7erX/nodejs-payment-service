import { Worker, Job } from "bullmq";
import { connection } from '../../redis/redis.provider';

const concurrency = 5

export const paymentsWorker = new Worker(
    'payments',
    async (job: Job) => {
        const { recipient, amount, index } = job.data;

        console.log(`Processing payment #${index} to ${recipient} for $${amount}`);

        if (Math.random() < .2) {
            throw new Error('Random payment failure');
        }

        await new Promise((r) => setTimeout(r, 500));

        return {
            payment_id: 'pay__' + Math.random().toString(36).substring(2, 9),
            status: 'pending',
            index,
        };
    },
    {
        concurrency,
        connection
    }
);

paymentsWorker.on('completed', (job, result) => {
    console.log(`Job ${job.id} succeeded:`, result);
})

paymentsWorker.on('failed', (j:any, result) => {
    console.log(`Job ${j.id} failed:`, result);
})
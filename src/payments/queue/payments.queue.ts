import { Queue } from "bullmq";
import { connection } from "src/redis/redis.provider";

export const paymentsQueue = new Queue('payments',{
    connection,
})
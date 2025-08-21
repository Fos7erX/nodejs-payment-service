import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Payment } from 'src/payments/payment.entity';

@Entity()
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Payment, { onDelete: 'CASCADE' })
  payment: Payment;

  @Column()
  fromStatus: string;

  @Column()
  toStatus: string;

  @Column({ nullable: true })
  reason?: string;

  @CreateDateColumn()
  changedAt: Date;
}

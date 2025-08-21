
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PaymentHistory } from './payment-history.entity';

@Entity()
export class PaymentUpdate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'reversed';

  @OneToMany(() => PaymentHistory, (history) => history.payment, { cascade: true })
  history: PaymentHistory[];
}
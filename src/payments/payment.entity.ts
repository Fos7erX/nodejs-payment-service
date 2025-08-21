import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

export class Payer{
    @Column()
    name:string;

    @Column()
    email:string;
}

@Entity()
export class Payment{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    description:string;

    @Column()
    due_date:Date;

    @Column()
    amount_cents:number;

    @Column()
    currency:string;

    @Column(() => Payer)
    payer:Payer;

    @Column({nullable:true})
    status:string;
}

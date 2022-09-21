import { OrderStatusEnum } from "src/enums/order-status.enum";
import { Meal } from "src/meals/entities/meal.entity";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('orders')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        type: 'enum',
        enum: OrderStatusEnum,
        default: OrderStatusEnum.PROGRESS,
    })
    status: string;

    @Column({
        default: ''
    })
    place: string;

    @Column({
        default: 0
    })
    phone: number;

    @Column()
    people: number;

    @Column()
    nbMeals: number;

    @Column({
        default: 0
    })
    price: number;

    @ManyToOne(()=> User, (user) => user.orders)
    user: User;

    @ManyToMany(() => Meal)
    @JoinTable()
    meals: Meal[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

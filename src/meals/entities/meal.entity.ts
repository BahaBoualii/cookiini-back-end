import { Category } from "src/categories/entities/category.entity";
import { Ingredient } from "src/ingredients/entities/ingredient.entity";
import { Order } from "src/orders/entities/order.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('meals')
export class Meal extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    name: string;

    @Column({
        type: "longtext",
    })
    description: string;

    @Column({
        nullable: false,
    })
    time: number;

    @Column({
        nullable: false,
    })
    calories: number;

    @Column()
    carbohydrates: number;

    @Column()
    protein: number;

    @Column()
    fats: number;
    
    @Column()
    vit_min: number;

    @Column({
        nullable: false,
    })
    image: string;

    @Column()
    video: string;

    @Column({
        default: 0
    })
    rating: number;

    @Column({
        default: 0
    })
    totalRating: number;

    @Column({
        default: 0
    })
    nbPeople: number;
    
    @Column({
        default: 0
    })
    nbPurchases: number;

    @Column()
    price2servings: number;

    @OneToMany(() => Ingredient, (ingredient) => ingredient.meal, {
        cascade: true,
        onDelete: "CASCADE"
    })
    ingredients: Ingredient[];

    @ManyToMany(() => Category, {
        cascade: true
    })
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => Order)
    orders: Order[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}   


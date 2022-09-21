import { UnitMeasurementEnum } from "src/enums/unit-measurement.enum";
import { Meal } from "src/meals/entities/meal.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('ingredients')
export class Ingredient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    quantity: string;

    @Column()
    atHome: boolean;

    @Column({
        type: 'enum',
        enum: UnitMeasurementEnum,
    })
    unitOfMeasurement: string;

    @ManyToOne(() => Meal, (meal) => meal.ingredients)
    meal: Meal;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

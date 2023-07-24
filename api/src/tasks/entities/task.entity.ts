import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from '../enums/task-status.enum';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    status: TaskStatus

    @ManyToOne(() => User, user => user.tasks, { eager: false })
    user: User;

    @Column()
    userId: number;
}
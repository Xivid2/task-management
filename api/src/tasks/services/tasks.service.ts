import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {}

    async getById(id: number, user: User): Promise<Task | null> {
        const task = await this.taskRepository.findOne({
            where: {
                id,
                userId: user.id
            }
        });
        console.log('task:', task)

        if (!task) {
            throw new NotFoundException();
        }

        return task;
    }

    async getAll(
        filterDto: GetTasksFilterDto,
        user: User
    ): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.taskRepository.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        const tasks = await query.getMany();

        return tasks;
    }

    async create(
        createTaskDto: CreateTaskDto,
        user: User,
    ): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();

        delete task.user;

        return task;
    }

    async updateStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getById(id, user);

        task.status = status;

        await task.save();

        return task;
    }

    async delete(id: number, user: User): Promise<void> {
        const task = await this.getById(id, user);

        await this.taskRepository.delete({
            id: task.id,
            userId: user.id,
        });
    }
}

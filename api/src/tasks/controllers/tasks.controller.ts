import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskStatusValidationPipe } from '../pipes/task-status-validation.pipe';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(
        private tasksService: TasksService
    ) {}

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" is retrieving task with id ${id}.`);

        return this.tasksService.getById(id, user);
    }

    @Get()
    getAllTasks(
        @Query() filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" is retrieving all tasks. Filters: ${JSON.stringify(filterDto)}.`);

        return this.tasksService.getAll(filterDto, user);
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" is creating a new task. Data: ${JSON.stringify(createTaskDto)}.`);

        return this.tasksService.create(createTaskDto, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', new TaskStatusValidationPipe()) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" is updating task ${id} status to ${status}.`);

        return this.tasksService.updateStatus(id, status, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        this.logger.verbose(`User "${user.username}" is deleting task ${id}.`);

        return this.tasksService.delete(id, user);
    }

}

import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Task } from './entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        AuthModule,
    ],
    controllers: [TasksController],
    providers: [TasksService]
})
export class TasksModule {}

import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmExModule } from './database/typeorm-ex.module';
import { TaskRepository } from './tasks/task.repository';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
  ],
})
export class AppModule {}

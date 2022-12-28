import { Controller, Request, Get, Post, Body, Delete, Param, Patch, Query, ParseIntPipe , UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-search-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import {AuthGuard} from '@nestjs/passport'
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { request } from 'http';

@Controller('tasks')
@UseGuards(AuthenticationGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto, @Request() request): Promise<Task[]> {
    return this.tasksService.getAllTasks(filterDto, request.user)
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @Request() request): Promise<Task> {
    return this.tasksService.getTaskById(id, request.user);
  }

  @Delete('/:id')           
  deleteTask(@Param('id', ParseIntPipe) id: number, @Request() request): Promise<void> {
    return this.tasksService.deleteTask(id, request.user);
  }

  @Patch('/:id/status') 
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @Request() request): Promise<Task> {
    return this.tasksService.updateStatus(id, status, request.user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() request): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, request.user)
  }
}

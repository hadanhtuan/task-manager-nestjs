import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksModule } from './tasks.module';
import { GetTaskFilterDto } from './dto/get-search-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  getAllTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user)
  }

  // getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //   const {status, search} = filterDto;
  //   console.log(filterDto)
  //   let tasks = this.getAllTasks()

  //   if(status) {
  //     tasks = tasks.filter(task => task.status == status)
  //   }
  //   if(search) {
  //     tasks = tasks.filter(task=> task.title.includes(search) || task.description.includes(search))
  //   }
  //   return tasks
  // }

  async getTaskById(id: number, user: User): Promise<Task> {
    const query = this.taskRepository.createQueryBuilder('Task')
    query.andWhere('Task.userId = :userId', {userId: user.id})
    query.andWhere('Task.id = :id',{id})

    const task = await query.getOne()

    if (!task) throw new NotFoundException();                                                       
    return task;
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const query = this.taskRepository.createQueryBuilder('Task').delete().from(Task).where('id = :id AND userId = :userId', {id, userId: user.id})
    const result = await query.execute()
 
    // const result = await this.taskRepository.delete({id})

    if(result.affected == 0) throw new NotFoundException()

  }

  async updateStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save()
    console.log(task)
    return task;
  }

  async createTask(@Body() createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save()

    return task;
  }
}

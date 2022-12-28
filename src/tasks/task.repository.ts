import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { GetTaskFilterDto } from './dto/get-search-task.dto';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const {status, search} = filterDto;
    const query = this.createQueryBuilder('Task')

    query.where('Task.userId = :userId', {userId: user.id})
    
    if(status) query.andWhere('Task.status = :status', {status})
    if(search) query.andWhere('Task.title Like :search Or Task.desccription Like :searcg', {search: `%${search}`})

    const tasks = await query.getMany()
    return tasks;
  }
}




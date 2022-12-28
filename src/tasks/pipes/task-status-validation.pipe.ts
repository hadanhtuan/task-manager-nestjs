import { TaskStatus } from '../task-status-enum';
import { ArgumentMetadata, BadGatewayException, BadRequestException, PipeTransform } from '@nestjs/common';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowStatused = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];
  
  transform(value: any, metadata: ArgumentMetadata) {
    if(!this.isValueValid(value)) {
      console.log(123)
      throw new BadRequestException(`Invalid Status`)
    }
    return value
  }

  private isValueValid(status: any) {
    return this.allowStatused.includes(status)
  }
}

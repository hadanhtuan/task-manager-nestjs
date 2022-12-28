import { TaskStatus } from "../task-status-enum";
import { IsOptional, IsIn } from "class-validator";

export class GetTaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.OPEN, TaskStatus.IN_PROGRESS])
  status: TaskStatus;

  search: string;
}
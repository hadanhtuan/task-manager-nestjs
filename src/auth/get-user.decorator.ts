import { createParamDecorator } from "@nestjs/common/decorators";
import { User } from "./user.entity";

export const GetUser  = createParamDecorator((data, req): User=>{
  return req.user
})
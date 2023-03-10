import { Controller, UseGuards,  Request, Get, Post, Body, Delete, Param, Patch, Query, ParseIntPipe , UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials';
import { AuthenticationGuard } from './guards/auth.guard';
import { User } from './user.entity';



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto)
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
    return this.authService.signIn(authCredentialsDto)
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import {TypeOrmModule} from '@nestjs/typeorm'
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Strategy } from "passport-jwt";
import { LocalStrategy } from './strategies/local.strategy';
import { JsonWebTokenStrategy } from './strategies/jwt.strategy';
import * as config from 'config'

const jwtConfig = config.get('jwt')

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn
      }
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, LocalStrategy, JsonWebTokenStrategy]
})
export class AuthModule {}

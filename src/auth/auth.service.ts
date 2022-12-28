import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto)
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const {id, username} = await this.validateUserPassword(authCredentialsDto)

    if(!id) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = {id, username}
    const accessToken = await this.jwtService.sign(payload)
    return {accessToken}
  }

  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({id})
  }
  
  async validateUserPassword(authCredentialsDto: AuthCredentialsDto) {
    const {username, password}  = authCredentialsDto;
    const user = await this.userRepository.findOneBy({username})
    
    if(user && await user.validatePassword(password)) return user
    else return new User()

  }

}

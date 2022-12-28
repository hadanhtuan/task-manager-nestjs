import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'


@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {username, password} = authCredentialsDto;

    const user = new User()
    user.username = username;
    user.salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(password, user.salt)

    try {
      await user.save()
      
    } catch (error) { 
      throw new ConflictException('Username already exits')
    }
  }

  // async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User> {
  //   const {username, password}  = authCredentialsDto;
  //   const user = await this.findOneBy({username})
    
  //   if(user && await user.validatePassword(password)) return user
    
  // }
}




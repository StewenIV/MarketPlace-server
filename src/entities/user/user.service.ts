import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from './user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  availableFields = ['nameFirst', 'nameLast', 'email', 'gender', 'birthDate'];

  private filterFields(body: { [k: string]: any }) {
    const filteredBody: { [k: string]: any } = {};

    Object.keys(body).filter((k) => {
      if (this.availableFields.includes(k)) {
        filteredBody[k] = body[k];
      }
    });

    return filteredBody;
  }

  public async createUser(userData: Partial<User>) {
    const salt = await bcrypt.genSalt(10);

    const newUser = this.userRepository.create({
      ...userData,
      password: await bcrypt.hash(userData.password, salt),
    });
    return await this.userRepository.save(newUser);
  }

  public async getAllUsers() {
    return await this.userRepository.find({
      select: this.availableFields as any,
    });
  }

  public async getUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: this.availableFields as any,
    });
  }

  public async updateUserData(id: number, body: UpdateUserDto) {
    return await this.userRepository.update(id, this.filterFields(body));
  }

    public async deleteUser(id: number) {
      return await this.userRepository.delete(id);
    }
} 
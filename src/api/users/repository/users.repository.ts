import { promises } from 'dns';
import { CreateUserDto, IUser, UpdateUserDto } from '../dto/users.dto';
import { Users } from '../schema/user.schema';

export class UsersRepository {
  async getAllUsers(): Promise<IUser[]> {
    return await Users.find();
  }
  async createUsers(usersData: Partial<CreateUserDto>): Promise<CreateUserDto> {
    const users = new Users(usersData);
    return await users.save();
  }
  async getUserById(id: string): Promise<IUser | null> {
    return await Users.findById(id);
  }
  async deleteById(id: string): Promise<IUser | null> {
    return await Users.findById(id);
  }
  async updataUsersById(
    id: string,
    dataUser: UpdateUserDto,
  ): Promise<IUser | null> {
    return await Users.findByIdAndUpdate(id, dataUser, { new: true });
  }
}

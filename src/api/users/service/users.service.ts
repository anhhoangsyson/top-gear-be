import { CreateUserDto, IUser, UpdateUserDto } from '../dto/users.dto';
import { UsersRepository } from '../repository/users.repository';

export class UsersService {
  private usersRepository = new UsersRepository();

  async createUsers(usersData: Partial<CreateUserDto>): Promise<CreateUserDto> {
    return await this.usersRepository.createUsers(usersData);
  }
  async getAllUsers(): Promise<IUser[]> {
    return await this.usersRepository.getAllUsers();
  }
  async getUserById(id: string): Promise<IUser | null> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  async deleteById(id: string): Promise<IUser | null> {
    const user = await this.usersRepository.deleteById(id);
    if (!user) {
      throw new Error('user not fuond');
    }
    return user;
  }
  async updateUserById(
    id: string,
    dataUser: UpdateUserDto,
  ): Promise<IUser | null> {
    const user = await this.usersRepository.updataUsersById(id, dataUser);
    if (!user) {
      throw new Error('user not found');
    }
    return user;
  }
}

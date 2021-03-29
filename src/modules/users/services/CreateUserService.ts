import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}
@injectable()
export default class CreateUserService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  
  public async execute({ name, email, password }: IRequest): Promise<User> {

    const checkUserExistis = await this.usersRepository.findByEmail(email);

    if(checkUserExistis) {
      throw new AppError(`Email address already user.`);
    }

    const hashedPassword = await this.hashProvider.genareteHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    });

    return user;
  }
}
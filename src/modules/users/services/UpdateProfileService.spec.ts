import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });
  
  it('Should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'teste@example.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com'
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
  });
   
  it('Should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const user = await fakeUsersRepository.create({
      name: 'test',
      email: 'teste@example.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'test',
        email: 'johndoe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'teste@example.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      old_password: '123456',
      password: '123123'
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('Should be able update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'teste@example.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'teste@example.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        old_password: 'wrong-old-password',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able update the profile from non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing-user_id',
        name: 'test',
        email: 'test@example.com'
    })).rejects.toBeInstanceOf(AppError);
  });
});
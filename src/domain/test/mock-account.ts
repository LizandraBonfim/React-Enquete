import faker from 'faker'
import { AuthenticationParams } from '@/domain/usecases/authentication'
import { AccountModel } from '../models';

export const MockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
});

export const MockAccountModel = (): AccountModel => ({
  accessToken: faker.random.uuid()
});

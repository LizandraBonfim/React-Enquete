import faker from 'faker';
import { AuthenticationParams } from 'domain/usecases/authentication';

export const MockAuthentication = (): AuthenticationParams => ({
    email: faker.internet.email(),
    password: faker.internet.password()
})
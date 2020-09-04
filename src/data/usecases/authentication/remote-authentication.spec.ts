import faker from 'faker';
import { RemoteAuthentication } from './remote-authentication';
import { HttpPostClientSpy } from '../../test';
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { AuthenticationParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';
import { MockAuthentication, MockAccountModel } from '@/domain/test';

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>();
  const sut = new RemoteAuthentication(url, httpPostClientSpy);

  return {
    sut, httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('should call HttpClient with correct URL ', async () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);
    await sut.auth(MockAuthentication());
    expect(httpPostClientSpy.url).toBe(url);
  })

  test('should call HttpClient with correct body ', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const authenticateParams = MockAuthentication()
    await sut.auth(authenticateParams)
    expect(httpPostClientSpy.body).toEqual(authenticateParams)
  })

  test('should throw InvalidCredentialsError if  HttpClient returns 401 ', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unathorized
    }

    const promise = sut.auth(MockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  })

  test('should throw UnexpectedError  if  HttpClient returns 400 ', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }

    const promise = sut.auth(MockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError());
  })

  test('should throw UnexpectedError  if  HttpClient returns 500 ', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }

    const promise = sut.auth(MockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError());
  })

  test('should throw UnexpectedError  if  HttpClient returns 404 ', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }

    const promise = sut.auth(MockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError());
  })

  test('should throw UnexpectedError  if  HttpClient returns 200 ', async () => {
    const { sut, httpPostClientSpy } = makeSut();

    const httpResult = MockAccountModel();

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }

    const account = await sut.auth(MockAuthentication())
    await expect(account).toEqual(httpResult);
  })

})

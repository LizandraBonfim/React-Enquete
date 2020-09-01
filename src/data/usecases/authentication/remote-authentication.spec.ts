import faker from 'faker';
import { RemoteAuthentication } from "./remote-authentication";
import { HttpPostClientSpy } from "../../test/mock-http-client";
import { MockAuthentication } from "../../../domain/models/test/mock-authentication";

type SutTypes = {
    sut: RemoteAuthentication;
    httpPostClientSpy: HttpPostClientSpy;
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
    const httpPostClientSpy = new HttpPostClientSpy();
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
    });

    test('should call HttpClient with correct body ', async () => {
        const { sut, httpPostClientSpy } = makeSut();
        const authenticateParams = MockAuthentication();
        await sut.auth(authenticateParams);
        expect(httpPostClientSpy.body).toEqual(authenticateParams);
    })
});

import faker from 'faker';
import { EmailValidation } from "./email-validation";
import { InvalidFieldError } from "@/validation/errors/invalid-field-error";

const makeSut = (): EmailValidation => new EmailValidation(faker.database.column());


describe('EmailValidation ', () => {
    test('Espera retornar um erro se o cemail for invalido ', () => {

        const sut = makeSut();
        const error = sut.validate(faker.random.word());
        expect(error).toEqual(new InvalidFieldError())
    })

    test('Espera retornar um falso se o cemail for valido ', () => {

        const sut = makeSut();
        const error = sut.validate(faker.internet.email());
        expect(error).toBeFalsy()
    })

    test('Espera retornar um falso se o cemail for valido ', () => {

        const sut = makeSut();
        const error = sut.validate('');
        expect(error).toBeFalsy()
    })
})

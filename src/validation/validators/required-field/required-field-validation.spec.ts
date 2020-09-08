import faker from 'faker';
import { RequiredFieldValidation } from "./required-field-validation";
import { RequiredFieldError } from "@/validation/errors";

const makeSut = (): RequiredFieldValidation => new RequiredFieldValidation(faker.database.column());

describe('RequiredFieldValidation ', () => {
    test('Espera retornar um erro se o campo estiver vazio ', () => {
        const sut = makeSut();
        const error = sut.validate('');
        expect(error).toEqual(new RequiredFieldError());

    })

    test('Espera retornar false caso o campo não estiver vazio ', () => {
        const sut = makeSut();
        const error = sut.validate(faker.random.word());
        expect(error).toBeFalsy();

    })

})

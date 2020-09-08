import faker from 'faker';
import { MinLengthValidation } from "./min-length-validation";
import { InvalidFieldError } from "@/validation/errors/invalid-field-error";

describe('MinLengthValidation ', () => {
    let sut;

    beforeEach(() => {
        sut = new MinLengthValidation('field', 5);

    });

    test('Espera retornar um erro se o valor estiver invalido ', () => {
        const error = sut.validate(faker.random.alphaNumeric(4));
        expect(error).toEqual(new InvalidFieldError());

    })

    test('Espera retornar falso se o valor estiver valido ', () => {

        const error = sut.validate(faker.random.alphaNumeric(6));
        expect(error).toBeFalsy();

    })
})

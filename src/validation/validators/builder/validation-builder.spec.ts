import faker from 'faker';
import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from "@/validation/validators"
import { ValidationBuilder as sut } from "./validation-builder";

describe('ValidationBuilder', () => {
    let field;

    beforeEach(() => {
        field = faker.database.column();
    });
    test('Deve retornar RequiredFieldValidation', () => {
        const validations = sut.field(field).required().build();

        expect(validations).toEqual([new RequiredFieldValidation(field)])
    })

    test('Deve retornar EmailValidation', () => {
        const validations = sut.field(field).email().build();

        expect(validations).toEqual([new EmailValidation(field)])
    })

    test('Deve retornar MinLengthValidation', () => {
        const validations = sut.field(field).min(5).build();

        expect(validations).toEqual([new MinLengthValidation(field, 5)]);
    })


    test('Deve retornar uma lista de validacoes', () => {
        const validations = sut.field(field).required().min(5).email().build();

        expect(validations).toEqual([
            new RequiredFieldValidation(field),
            new MinLengthValidation(field, 5),
            new EmailValidation(field),
        ]);
    })


})
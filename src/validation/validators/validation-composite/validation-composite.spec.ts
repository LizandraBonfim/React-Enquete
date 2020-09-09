import faker from 'faker';
import { ValidationComposite } from './validation-composite';
import { FieldValidationSpy } from '../test';

type SutTypes = {
    sut: ValidationComposite
    fieldValidationSpy: FieldValidationSpy[]
}

const makeSut = (fieldName: string): SutTypes => {
    const fieldValidationSpy = [
        new FieldValidationSpy(fieldName),
        new FieldValidationSpy(fieldName)
    ];

    const sut = new ValidationComposite(fieldValidationSpy);

    return {
        sut, fieldValidationSpy
    }
}
describe('ValidationComposite ', () => {
    let fieldName;
    beforeEach(() => {
        fieldName = faker.database.column();
    });

    test('Espera retornar um erro se  qualquer validação falhar. ', () => {
        const { sut, fieldValidationSpy } = makeSut(fieldName);
        const errorMessage = faker.random.words();
        fieldValidationSpy[0].error = new Error(errorMessage);
        fieldValidationSpy[1].error = new Error(faker.random.words());
        const error = sut.validate(fieldName, faker.random.words());

        expect(error).toBe(errorMessage)

    })

    test('Espera retornar um erro se  qualquer validação falhar. ', () => {
        const { sut } = makeSut(fieldName);
        const error = sut.validate(fieldName, faker.random.words());

        expect(error).toBeFalsy()

    })



})

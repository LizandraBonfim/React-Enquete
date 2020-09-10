import React from 'react';
import faker from 'faker';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import Input from './input';
import Context from '@/presentation/contexts/form/form-context';

const makeSut = (fieldName: string): RenderResult => {
    return render(
        <Context.Provider value={{ state: {} }}>
            <Input name={fieldName} />
        </Context.Provider >
    );
}


describe('input', () => {
    let sut, field, input;

    beforeEach(() => {

        field = faker.database.column();
        sut = makeSut(field);
        input = sut.getByTestId(field) as HTMLInputElement
    })
    test('Input deve iniciar com readOnly ', () => {

        expect(input.readOnly).toBe(true)
    })

    test('Input remover readOnly quando estiver com focus', () => {

        fireEvent.focus(input)
        expect(input.readOnly).toBe(false)
    })


})

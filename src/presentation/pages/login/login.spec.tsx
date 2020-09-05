import React from 'react';
import { render, RenderResult, cleanup, fireEvent } from '@testing-library/react';
import Login from './login';
import { Validation } from '@/presentation/protocols/validation';

class ValidationSpy implements Validation {
    errorMessage: string
    input: object

    validate(input: object): string {
        this.input = input
        return this.errorMessage
    }
}

type SutTypes = {
    sut: RenderResult,
    validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy();
    const sut = render(<Login validation={validationSpy} />);
    return {
        sut, validationSpy
    }
}

describe('should ', () => {
    afterEach(cleanup)
    test('Renderizando spinner e erros ', () => {
        const { sut } = makeSut();
        const errorWrap = sut.getByTestId('error-wrap');
        expect(errorWrap.childElementCount).toBe(0)

        const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
        expect(submitButton.disabled).toBe(true);

        const emailStatus = sut.getByTestId('email-status');
        expect(emailStatus.title).toBe('Campo obrigatorio')
        expect(emailStatus.textContent).toBe('🔴')



        const passwordStatus = sut.getByTestId('password-status');
        expect(passwordStatus.title).toBe('Campo obrigatorio')
        expect(passwordStatus.textContent).toBe('🔴')
    })

    test('Valida o valor do input de email ', () => {
        const { sut, validationSpy } = makeSut();
        const emailInput = sut.getByTestId('email');
        fireEvent.input(emailInput, { target: { value: 'any_email' } });

        expect(validationSpy.input).toEqual({ email: 'any_email' })

    })

    test('Valida o valor do input de senha ', () => {
        const { sut, validationSpy } = makeSut();
        const passwordInput = sut.getByTestId('password');
        fireEvent.input(passwordInput, { target: { value: 'password' } });

        expect(validationSpy.input).toEqual({ password: 'password' })

    })
})

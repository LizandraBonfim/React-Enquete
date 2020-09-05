import React from 'react';
import faker from 'faker';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import 'jest-localstorage-mock';
import { render, RenderResult, cleanup, fireEvent, getByTestId, waitFor } from '@testing-library/react';
import Login from './login';
import { ValidationStub, AuthenticationSpy } from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';


type SutTypes = {
    sut: RenderResult
    authenticationSpy: AuthenticationSpy
}

type SutParams = {
    validationError: string
}

const history = createMemoryHistory();

const makeSut = (params?: SutParams): SutTypes => {
    const validationStub = new ValidationStub();
    const authenticationSpy = new AuthenticationSpy();
    validationStub.errorMessage = params?.validationError;

    const sut = render(
        <Router history={history}>

            <Login validation={validationStub} authentication={authenticationSpy} />
        </Router>
    );
    return {
        sut, authenticationSpy
    }
}

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {

    populateEmailField(sut, email);
    populatePasswordField(sut, password);


    const submitButton = sut.getByTestId('submit');
    fireEvent.click(submitButton);

}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: email } });
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: password } });
}

const simulateStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
    const emailStatus = sut.getByTestId(`${fieldName}-status`);
    expect(emailStatus.title).toBe(validationError || 'Tudo certo')
    expect(emailStatus.textContent).toBe(validationError ? '🔴' : '✓')
}
describe('should ', () => {
    afterEach(cleanup);
    beforeEach(() => {
        localStorage.clear()
    })
    test('Renderizando spinner e erros ', () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });

        const errorWrap = sut.getByTestId('error-wrap');
        expect(errorWrap.childElementCount).toBe(0)

        const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
        expect(submitButton.disabled).toBe(true);

        simulateStatusForField(sut, 'email', validationError);
        simulateStatusForField(sut, 'password', validationError);

    })


    test('Deve mostrar erro se preenchido incorretamente o email ', () => {

        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });

        populateEmailField(sut);
        simulateStatusForField(sut, 'email', validationError);


    })

    test('Deve mostrar erro se preenchido incorretamente a senha     ', () => {

        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        populatePasswordField(sut);
        simulateStatusForField(sut, 'password', validationError);


    })

    test('Deve mostrar mensagem de sucesso se o email estiver correto', () => {

        const { sut } = makeSut();
        populateEmailField(sut);
        simulateStatusForField(sut, 'email');

    })

    test('Deve mostrar mensagem de sucesso se a senha estiver correta', () => {

        const { sut } = makeSut();
        populatePasswordField(sut);
        simulateStatusForField(sut, 'password');

    })

    test('O button deve estar habilitado se as informacoes estiverem validas', () => {

        const { sut } = makeSut();

        populateEmailField(sut);
        populatePasswordField(sut);

        const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
        expect(submitButton.disabled).toBe(false);

    })

    test('Deve mostrar o spinner assim que o formulario for submetido', () => {

        const { sut } = makeSut();

        simulateValidSubmit(sut)

        const spinner = sut.getByTestId('spinner');
        expect(spinner).toBeTruthy();

    })

    test('Deve authenticar caso os valores forem validados', () => {

        const { sut, authenticationSpy } = makeSut();

        const email = faker.internet.email();
        const password = faker.internet.password();
        simulateValidSubmit(sut, email, password)

        expect(authenticationSpy.params).toEqual({
            email, password
        });

    })

    test('Deve authenticar apenas uma vez ', () => {

        const { sut, authenticationSpy } = makeSut();
        simulateValidSubmit(sut)
        simulateValidSubmit(sut)

        expect(authenticationSpy.callsCount).toEqual(1);

    })

    test('Nao deve authenticar se o formulário estiver invalido. ', async () => {

        const { sut, authenticationSpy } = makeSut();
        const error = new InvalidCredentialsError()
        jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error));

        simulateValidSubmit(sut)
        fireEvent.submit(sut.getByTestId('form'));

        const errorWrap = sut.getByTestId('error-wrap');
        await waitFor(() => errorWrap)

        const mainError = sut.getByTestId('main-error');
        expect(mainError.textContent).toBe(error.message);

        expect(errorWrap.childElementCount).toBe(1)

    })

    test('Deve validar as informacoes do localstorage. ', async () => {

        const { sut, authenticationSpy } = makeSut();
        simulateValidSubmit(sut)
        await waitFor(() => sut.getByTestId('form'));
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)

    })

    test('Deve renderizar pagina de singup. ', async () => {

        const { sut } = makeSut();

        const singup = sut.getByTestId('singup');
        fireEvent.click(singup);
        expect(history.length).toBe(2);
        expect(history.location.pathname).toBe('/singup')

    })
})

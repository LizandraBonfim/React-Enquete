import React from 'react';
import faker from 'faker';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import 'jest-localstorage-mock';
import {
    render,
    RenderResult,
    cleanup,
    fireEvent,
    waitFor
} from '@testing-library/react';
import { Login } from '@/presentation/pages';
import { ValidationStub, AuthenticationSpy } from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';


type SutTypes = {
    sut: RenderResult
    authenticationSpy: AuthenticationSpy
}

type SutParams = {
    validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] });

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

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {

    populateEmailField(sut, email);
    populatePasswordField(sut, password);

    const form = sut.getByTestId('form');
    fireEvent.submit(form);
    await waitFor(() => form)

}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: email } });
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: password } });
}

const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
    const emailStatus = sut.getByTestId(`${fieldName}-status`);
    expect(emailStatus.title).toBe(validationError || 'Tudo certo')
    expect(emailStatus.textContent).toBe(validationError ? '🔴' : '✓')
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
    const errorWrap = sut.getByTestId('error-wrap');
    expect(errorWrap.childElementCount).toBe(count)
}

const testElementExists = (sut: RenderResult, fieldName: string): void => {
    const element = sut.getByTestId(fieldName);
    expect(element).toBeTruthy();
}

const testElementText = (sut: RenderResult, fieldName: string, error: string): void => {

    const mainError = sut.getByTestId(fieldName);
    expect(mainError.textContent).toBe(error);
}

const testButtonisDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {

    const submitButton = sut.getByTestId(fieldName) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(isDisabled);
}


describe('should ', () => {
    afterEach(cleanup);
    beforeEach(() => {
        localStorage.clear()
    })
    test('Renderizando spinner e erros ', () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });

        testErrorWrapChildCount(sut, 0);

        testButtonisDisabled(sut, 'submit', true);

        testStatusForField(sut, 'email', validationError);
        testStatusForField(sut, 'password', validationError);

    })


    test('Deve mostrar erro se preenchido incorretamente o email ', () => {

        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });

        populateEmailField(sut);
        testStatusForField(sut, 'email', validationError);


    })

    test('Deve mostrar erro se preenchido incorretamente a senha     ', () => {

        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        populatePasswordField(sut);
        testStatusForField(sut, 'password', validationError);


    })

    test('Deve mostrar mensagem de sucesso se o email estiver correto', () => {

        const { sut } = makeSut();
        populateEmailField(sut);
        testStatusForField(sut, 'email');

    })

    test('Deve mostrar mensagem de sucesso se a senha estiver correta', () => {

        const { sut } = makeSut();
        populatePasswordField(sut);
        testStatusForField(sut, 'password');

    })

    test('O button deve estar habilitado se as informacoes estiverem validas', () => {

        const { sut } = makeSut();

        populateEmailField(sut);
        populatePasswordField(sut);

        testButtonisDisabled(sut, 'submit', false);


    })

    test('Deve mostrar o spinner assim que o formulario for submetido', async () => {

        const { sut } = makeSut();

        await simulateValidSubmit(sut)

        testElementExists(sut, 'spinner');

    })

    test('Deve authenticar caso os valores forem validados', async () => {

        const { sut, authenticationSpy } = makeSut();

        const email = faker.internet.email();
        const password = faker.internet.password();
        await simulateValidSubmit(sut, email, password)

        expect(authenticationSpy.params).toEqual({
            email, password
        });

    })

    test('Deve authenticar apenas uma vez ', async () => {

        const { sut, authenticationSpy } = makeSut();
        await simulateValidSubmit(sut)
        await simulateValidSubmit(sut)

        expect(authenticationSpy.callsCount).toEqual(1);

    })

    test('Nao deve authenticar se o formulário estiver invalido. ', async () => {

        const { sut, authenticationSpy } = makeSut();
        const error = new InvalidCredentialsError()
        jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error));

        await simulateValidSubmit(sut);
        testElementText(sut, 'main-error', error.message);

        testErrorWrapChildCount(sut, 1);
    })

    test('Deve validar as informacoes do localstorage. ', async () => {

        const { sut, authenticationSpy } = makeSut();
        await simulateValidSubmit(sut)
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
        expect(history.length).toBe(1);
        expect(history.location.pathname).toBe('/')

    })

    test('Deve renderizar pagina de singup. ', async () => {

        const { sut } = makeSut();

        const singup = sut.getByTestId('singup');
        fireEvent.click(singup);
        expect(history.length).toBe(2);
        expect(history.location.pathname).toBe('/singup')

    })
})

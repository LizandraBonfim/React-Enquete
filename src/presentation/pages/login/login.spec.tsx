import React from 'react';
import { render } from '@testing-library/react';
import Login from './login';


describe('should ', () => {

    test('Renderizando spinner e erros ', () => {
        const { getByTestId } = render(<Login />);
        const errorWrap = getByTestId('error-wrap');
        expect(errorWrap.childElementCount).toBe(0)
    })
})

import React, { useContext } from 'react';
import Spinner from '../spinner/spinner';
import Styles from './form-status-styles.scss';
import Context from '@/presentation/contexts/form/form-context'

const FormStatus: React.FC = () => {
    const { isLoading, errorMessage } = useContext(Context);
    return (


        <div data-testid="error-wrap" className={Styles.errorWrap}>
            {isLoading && <Spinner />}
            {errorMessage && <span className={Styles.error}>Erro</span>}
        </div>

    )
}

export default FormStatus;
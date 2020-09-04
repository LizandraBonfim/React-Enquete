import React from 'react';
import Spinner from '../spinner/spinner';
import Styles from './form-status-styles.scss';


const FormStatus: React.FC = () => {
    return (
        <div className={Styles.errorWrap}>
            <Spinner />
            <span className={Styles.error}>Erro</span>
        </div>
    )
}

export default FormStatus;
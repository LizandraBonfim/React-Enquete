import React from 'react';
import Styles from './spinner-styles.scss';


const Spinner: React.FC = () => {
    return <div data-testid="spinner" className={Styles.spinner}>Loading...</div>
}

export default Spinner;
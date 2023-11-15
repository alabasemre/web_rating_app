import styles from './TextInput.module.css';
import PropTypes from 'prop-types';

function TextInput({ label, id, name }) {
    return (
        <div className={styles['input-group']}>
            <label htmlFor={id}>{label}</label>
            <input type='text' name={name} id={id} />
        </div>
    );
}

TextInput.propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
};

export default TextInput;

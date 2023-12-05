import styles from './TextInput.module.css';
import PropTypes from 'prop-types';

function TextInput({ label, id, name, type, onChange, value }) {
    return (
        <div className={styles['input-group']}>
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                name={name}
                id={id}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                value={value}
            />
        </div>
    );
}

TextInput.propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
};

export default TextInput;

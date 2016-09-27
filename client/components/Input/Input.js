import React from 'react'
import style from './Input.scss';
import classnames from 'classnames';
import MaskedInput from 'react-maskedinput';

export default function Input({name, onChange, onBlur, placeholder, className, error = false, mask = false}) {
    className = classnames(className, style.Input, {
        [style.Error]: error
    });

    return (
        <div>
            {(() => {
                if (mask) {
                    return <MaskedInput {...{name, mask, onChange, onBlur, placeholder, className}}/>
                } else {
                    return <input {...{name, onChange, onBlur, placeholder, className}} />
                }
            })()}
        </div>
    )
}

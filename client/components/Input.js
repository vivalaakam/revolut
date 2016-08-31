import React from 'react'
import classnames from 'classnames';
export default function Input({name, onChange, onBlur, placeholder, className, error = false}) {
    className = classnames(className, 'Input', {
        'Error': error
    });

    return (
        <div>
            <input {...{name, onChange, onBlur, placeholder, className}} />
        </div>
    )
}

import React from 'react'
import classnames from 'classnames';
export default function Input({name, onChange, placeholder, className, error = false}) {
    className = classnames(className, 'Input', {
        'Error': error
    });

    return (
        <div>
            <input {...{name, onChange, placeholder, className}} />
        </div>
    )
}

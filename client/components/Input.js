import React from 'react'
import classnames from 'classnames';
export default function Input({name, onChange, placeholder, className, error = false}) {
    className = classnames(className, {
        'error': error
    });

    return (
        <div>
            <input {...{name, onChange, placeholder, className}} />
            {error ? (
                <span>{error}</span>
            ) : ''}
        </div>
    )
}

import React from 'react';
import classnames from 'classnames';
import style from './Progress.scss';

export default function Progress({form}) {
    console.log(form);
    const state = classnames(style.State, {
        [style.State_inProgress]: form.can_login === 'in_progress',
        [style.State_success]: form.can_login === 'success',
        [style.State_failure]: form.can_login === 'failure'
    });

    return (
        <div className={style.Progress}>
            <div className={state}>
                {form.can_login && form.can_login === 'in_progress' ? form.progress : ''}
            </div>
        </div>
    )
}
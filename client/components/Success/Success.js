import React from 'react';
import style from './Success.scss';

export default function Success() {
    return (
        <div className={style.Success}>
            <h3 className={style.title}>Great!</h3>
            <p className={style.text}>We’ll contact you on delivery
                details as soon as possible</p>
        </div>
    );
}
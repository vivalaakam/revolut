import React from 'react';
import style from './Back.scss';
import bg from './bg.png';

export default function Back() {
    return (
        <div className={style.Back}>
            <div className={style.Row}>
                The new fair way to instantly
                send and spend money
            </div>
            <img src={bg} className={style.Image}/>
        </div>
    );
}
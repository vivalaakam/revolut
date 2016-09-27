import React from 'react';
import style from './Url.scss';

export default function Url({user}) {
    let username = user.username || 'username';
    let astro = user.astrosign || 'astrosign';

    let userClass = username === 'username' ? style.gray : '';
    let astroClass = astro === 'astrosign' ? style.gray : '';

    return (
        <div className={style.Url}>
            http://r.revolut/<span className={astroClass}>{astro}</span>/<span
            className={userClass}>{username}</span>
        </div>
    );
}
import React, { PropTypes } from 'react';
import style from './Url.scss';

export default function Url({ user }) {
  const username = user.username || 'username';
  const astro = user.astrosign || 'astrosign';
  const userClass = username === 'username' ? style.gray : '';
  const astroClass = astro === 'astrosign' ? style.gray : '';

  return (
    <div className={style.Url}>
      http://r.revolut/<span className={astroClass}>{astro}</span>/
      <span className={userClass}>{username}</span>
    </div>
  );
}

Url.propTypes = {
  user: PropTypes.object.isRequired
};

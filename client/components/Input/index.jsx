import React, { PropTypes } from 'react';
import classnames from 'classnames';
import MaskedInput from 'react-maskedinput';
import style from './Input.scss';

export default function Input({ name, onChange, onBlur, placeholder, className, error = false, mask = false }) {
  className = classnames(className, style.Input, {
    [style.Error]: error
  });

  return (
    <div>
      {(() => {
        if (mask) {
          return <MaskedInput {...{ name, mask, onChange, onBlur, placeholder, className }} />;
        }
        return <input {...{ name, onChange, onBlur, placeholder, className }} />;
      })()}
    </div>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  mask: PropTypes.string
};

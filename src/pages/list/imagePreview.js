import React from 'react';
import style from './imagePreview.scss';

export default function ImagePreview(props) {
  return (<div className={style.container} onClick={props.onRequestClose}>
    <img className={style.image} src={props.url} alt="preview" />
  </div>);
}

ImagePreview.propTypes = {
  onRequestClose: React.PropTypes.func,
  url: React.PropTypes.string,
};

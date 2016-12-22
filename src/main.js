import React from 'react';
import Header from './components/header';
import style from './main.scss';

export default function Main(props) {
  return (<div>
    <Header />
    <div className={style.content}>
      {props.children}
    </div>
  </div>);
}

Main.propTypes = {
  children: React.PropTypes.node,
};

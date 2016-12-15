import React from 'react';
import Item from './comp.Item';
import style from './daigou.scss';
import config from './config.json';
import data from 'src/data/index';

function getDataForCat(cat) {
  return data({ tags: cat.tags }, cat.limit);
}

export default function Daigou() {
  return (<div>
  {config.map((cat, index) => (
    <div key={index}>
      <h3 className={style.sectionTitle}>{cat.name}</h3>
      <ul className={style.itemList}>
        {getDataForCat(cat).map((item, itemKey) =>
          (<li className={style.item} key={itemKey}><Item {...item} postage={cat.postage} /></li>))}
      </ul>
    </div>))}
  </div>);
}

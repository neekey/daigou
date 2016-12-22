import React from 'react';
import Item from './comp.Item';
import style from './daigou.scss';
import data from 'src/data/index';

function getDataForCat(cat) {
  return data({ tags: cat.tags }, cat.limit);
}

export default function Daigou(props) {
  const dataQuery = props.location.query;
  return (<div>
    <div>
      <h3 className={style.sectionTitle}>{dataQuery.name}</h3>
      <ul className={style.itemList}>
        {getDataForCat(dataQuery).map((item, itemKey) =>
          (<li className={style.item} key={itemKey}>
            <Item {...item} postage={dataQuery.postage} /></li>))}
      </ul>
    </div>
  </div>);
}

Daigou.propTypes = {
  location: React.PropTypes.object,
};

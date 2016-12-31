import React from 'react';
import Item from './comp.Item';
import style from './daigou.scss';
import data from 'src/data/index';
import config from '../../components/header/header.json';

function getDataForCat(cat) {
  return data({ tags: cat.tags, keyword: cat.keyword }, cat.limit);
}

export default function Daigou(props) {
  const configId = props.params.id || 0;
  const dataQuery = config[configId];
  return (<div>
    <div>
      <h3 className={style.sectionTitle}>{dataQuery.name}</h3>
      <ul className={style.itemList}>
        {getDataForCat(dataQuery).map((item) =>
          (<li className={style.item} key={item.id}>
            <Item
              {...item}
              name={item.chinese_name || item.name}
              revenue={item.revenue || dataQuery.revenue}
              postage={item.postage || dataQuery.postage} /></li>))}
      </ul>
    </div>
  </div>);
}

Daigou.propTypes = {
  params: React.PropTypes.object,
};

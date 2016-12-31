import React from 'react';
import Item from './comp.Item';
import style from './daigou.scss';
import data from 'src/data/index';
import config from '../../components/header/header.json';
import ImagePreview from './imagePreview';

function getDataForCat(cat) {
  return data({ tags: cat.tags, keyword: cat.keyword }, cat.limit);
}

export default class Daigou extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreviewOpen: false,
      currentURL: null,
    };
    this.onImagePreviewOpen = this.onImagePreviewOpen.bind(this);
    this.onImagePreviewClose = this.onImagePreviewClose.bind(this);
  }

  onImagePreviewOpen(url) {
    this.setState({
      currentURL: url,
      imagePreviewOpen: true,
    });
  }

  onImagePreviewClose() {
    this.setState({
      currentURL: null,
      imagePreviewOpen: false,
    });
  }

  render() {
    const props = this.props;
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
                onImageClick={this.onImagePreviewOpen}
                name={item.chinese_name || item.name}
                revenue={item.revenue || dataQuery.revenue}
                postage={item.postage || dataQuery.postage} /></li>))}
        </ul>
      </div>

      {this.state.imagePreviewOpen ?
        <ImagePreview url={this.state.currentURL} onRequestClose={this.onImagePreviewClose} /> : null}
    </div>);
  }
}

Daigou.propTypes = {
  params: React.PropTypes.object,
};

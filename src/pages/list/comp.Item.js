import React from 'react';
import style from './comp.Item.scss';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
// requires and returns all modules that match

const images = requireAll(require.context('src/images', true, /.*\.jpg$/));

function ceilForInteger(price) {
  return Math.ceil(price / 10) * 10;
}

function AUDToRMB(aud) {
  return aud * 5.1;
}

function getSalePrice(originalPrice, postage, revenue) {
  const cost = AUDToRMB(parseFloat(originalPrice) + parseFloat(postage));
  console.log(cost, revenue);
  return ceilForInteger(Math.ceil(cost + parseInt(revenue, 10)));
}

function getLocalImagesAddress(pic) {
  let picURL = pic;
  images.forEach(image => {
    if (image.match(pic)) {
      picURL = image;
    }
  });

  return picURL;
}

export default function Item(props) {
  return (<div className={style.container}>
    <div className={style.imgContainer}>
      <img className={style.img} src={getLocalImagesAddress(props.pic)} alt={props.name} /></div>
    <p className={style.name}>{props.name}</p>
    <p className={style.price}>{getSalePrice(props.price, props.postage, props.revenue)}</p>
  </div>);
}

Item.propTypes = {
  pic: React.PropTypes.string,
  name: React.PropTypes.string,
  price: React.PropTypes.string,
  postage: React.PropTypes.any,
  revenue: React.PropTypes.string,
};

Item.defaultProps = {
  revenue: '50',
  postage: '0',
};

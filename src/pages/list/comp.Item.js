import React from 'react';
import style from './comp.Item.scss';
import LazyLoad from 'react-lazyload';
import placeholderImg from './placeholder.png';
const isSource = document.location.host.includes('-source');

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
// requires and returns all modules that match

const images = requireAll(require.context('src/images', true, /.*\.(jpg|png)$/));

function ceilForInteger(price) {
  const modulo = price % 5;
  return Math.floor(price / 5) * 5 + (modulo ? 5 : 0);
}

function AUDToRMB(aud) {
  return aud * 5.1;
}

function getSalePrice(originalPrice, postage, revenue) {
  const cost = AUDToRMB(parseFloat(originalPrice) + parseFloat(postage));
  const salePrice = `¥${ceilForInteger(Math.ceil(cost + parseInt(revenue, 10)))}`;
  if (isSource) {
    return `$${originalPrice} ${salePrice}`;
  }
  return salePrice;
}

function convertImageURLToLocalName(pic) {
  return pic
    .replace(/^https?:\/\/[^\/]+\//, '')
    .replace(/\//g, '_')
    .replace(/\.(jpg|png)$/, '');
}

function getLocalImagesAddress(pic) {
  let picURL = convertImageURLToLocalName(pic);
  images.forEach(image => {
    if (image.match(picURL)) {
      picURL = image;
    }
  });

  return picURL;
}

export default function Item(props) {
  return (<div className={style.container}>
    <LazyLoad
      once
      placeholder={<img className={style.imgPlaceholder} src={placeholderImg} alt={props.name} />}>
      <img
        onClick={() => props.onImageClick(props.pic)}
        className={style.img}
        src={getLocalImagesAddress(props.pic)}
        alt={props.name} />
    </LazyLoad>
    <p className={style.price}>{getSalePrice(props.price, props.postage, props.revenue)}</p>
    <p className={style.name}>{props.name}</p>
  </div>);
}

Item.propTypes = {
  pic: React.PropTypes.string,
  name: React.PropTypes.string,
  price: React.PropTypes.string,
  postage: React.PropTypes.any,
  revenue: React.PropTypes.string,
  onImageClick: React.PropTypes.func,
};

Item.defaultProps = {
  revenue: '50',
  postage: '0',
  onImageClick: () => {},
};

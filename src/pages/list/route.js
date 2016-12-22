import Daigou from './daigou';
import configs from '../../components/header/header.json';

export const defaultLocation = {
  pathname: '/list',
  query: configs[0],
};

export default {
  path: '/list',
  component: Daigou,
};

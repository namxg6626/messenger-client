import Axios from 'axios';
import { config } from 'src/constants/config';

const axios = (() => {
  const instance = Axios.create({
    baseURL: config.BASE_URL,
  });

  return instance;
})();

export default axios;

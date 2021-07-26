import Axios from 'axios';
import { BASE_URL } from 'src/constants/endpoint';

const axios = (() => {
  const instance = Axios.create({
    baseURL: BASE_URL,
  });

  return instance;
})();

export default axios;

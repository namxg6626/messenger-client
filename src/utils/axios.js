import Axios from 'axios';
import { config } from 'src/constants/config';
import { convertStringToJson } from '@utils/converter';

const axios = (() => {
  const instance = Axios.create({
    baseURL: config.BASE_URL,
  });

  instance.interceptors.request.use((config) => {
    if (!config.headers) config.headers = {};

    const LOCAL_STORAGE_KEY = 'persist:auth';
    const authState = convertStringToJson(localStorage.getItem(LOCAL_STORAGE_KEY));
    const token = authState?.data?.jwt || '';
    config.headers.authorization = `Bearer ${token}`;

    return config;
  });

  return instance;
})();

export default axios;

import axios from '@utils/axios';
import endpoints from 'src/constants/endpoint';

export const login = (username, password) =>
  new Promise((resl, rej) => {
    axios
      .post(endpoints.authLogin, { username, password })
      .then((res) => resl(res.data))
      .catch((e) => rej(e.response.message));
  });

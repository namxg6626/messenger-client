import axios from '@utils/axios';
import endpoints from 'src/constants/endpoint';

export default class AuthHttp {
  login = (username, password) =>
    new Promise((resl, rej) => {
      axios
        .post(endpoints.authLogin, { username, password })
        .then((res) => resl(res.data))
        .catch((e) => rej(e.response.data.message));
    });

  signUp = (username, displayname, password) =>
    new Promise((resl, rej) => {
      axios
        .post(endpoints.authSignUp, { username, password, displayname })
        .then((res) => resl(res.data.result))
        .catch((e) => rej(e.response.data.message));
    });
}

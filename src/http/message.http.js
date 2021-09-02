import axios from '@utils/axios';
import endpoints from 'src/constants/endpoint';
import '@models/';

export default class MessageHttp {
  /**
   *
   * @param {string} conversationId
   * @param {number} page
   * @returns {Promise<Message[]>}
   */
  getMessageByConversationId = (conversationId, page) =>
    new Promise((resl, rej) => {
      axios
        .get(endpoints.messages, {
          params: {
            conversationId,
            page,
          },
        })
        .then((res) => resl(res.data.result || []))
        .catch((e) => rej(e.response.data.message));
    });
}

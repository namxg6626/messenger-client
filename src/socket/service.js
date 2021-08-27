import io from 'socket.io-client';
import { TypeConversation } from './constants';
import { SocketEventEnum } from './events';

/**
 *
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} username
 * @property {string} displayname
 * @property {boolean} isOnline
 */

export class SocketService {
  /**
   *
   * @param {import('socket.io-client').Socket} socket
   * @returns void
   */
  constructor(socket) {
    this.socket = socket || io();
  }

  /**
   *
   * @param {import('socket.io-client').Socket} socket
   * @returns void
   */
  setSocket = (socket) => {
    this.socket = socket;
  };

  /**
   *
   * @param {User} user
   */
  setUser = (user) => {
    this.user = user;
  };

  /**
   *
   * @param {string} title name of the conversation
   * @param {string} from id of the creator
   * @param {string} to id of the partner
   */
  clientCreatePrivateConversation = (title, to) => {
    this.socket.emit({
      typeConversation: TypeConversation.PRIVATE,
      title,
      from: this.user._id,
      to,
    });
  };

  /**
   *
   * @param {string} title name of the conversation
   * @param {string} from id of the creator
   * @param {Array<string>} members list of members will be added
   */
  clientCreateGroupConversation = (title, members) => {
    this.socket.emit({
      typeConversation: TypeConversation.GROUP,
      title,
      from: this.user._id,
      to: null,
      members,
    });
  };

  /**
   *
   * @param {(user?: User) => any} callback to handle user data
   */
  clientFetchUser = (callback = () => null) => {
    this.socket.emit(SocketEventEnum.CLIENT_GET_CONVERSATIONS);
    this.socket.on(SocketEventEnum.SV_SEND_CURR_USER, (data) => {
      this.setUser(data);
      callback(data);
    });
  };

  /**
   *
   * @param {(users?: Array<User>) => any} callback
   */
  clientFetchOnlines = (callback = () => null) => {
    this.socket.on(SocketEventEnum.SV_SEND_USERS_ONLINE, callback);
  };
}

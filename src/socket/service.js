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

/**
 * @typedef {Object} Conversation
 * @property {string} _id
 * @property {string} typeConversation
 * @property {string} title
 * @property {string} from
 * @property {string} to
 * @property {Array<string>} members
 * @property {{
 *    messageId: string;
 *    content: string
 * }} newMessage
 */

/**
 *
 */

export class SocketService {
  /**
   *
   * @param {import('socket.io-client').Socket} socket
   * @returns void
   */
  constructor(socket) {
    this.socket = socket || io();

    /**
     * @type User
     */
    this.user = {};
  }

  /**
   *
   * @param {import('socket.io-client').Socket} socket
   * @returns void
   */
  setSocket = (socket) => {
    this.socket = socket;
  };

  getSocket = () => this.socket;

  /**
   *
   * @param {User} user
   */
  setUser = (user) => {
    this.user = user;
  };

  getUser = () => this.user;

  /**
   *
   * @param {string} title name of the conversation
   * @param {string} from id of the creator
   * @param {string} to id of the partner
   */
  clientCreatePrivateConversation = (title, to) => {
    this.socket.emit(SocketEventEnum.CLIENT_CREATE_CONVERSATION, {
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

  /**
   *
   * @param {string} conversationId
   * @param {string} fromUserId
   * @param {string} message
   */
  clientSendMessage = (conversationId, fromUserId, message) => {
    this.socket.emit(SocketEventEnum.CLIENT_SEND_MESSAGE, {
      conversationId,
      fromUserId,
      message,
    });
  };

  /**
   *
   * @param {(conversations?: Array<Conversation>) => any} callback
   */
  onReceiveConversations = (callback) => {
    this.socket.on(SocketEventEnum.SV_SEND_CONVERSATIONS, callback);
  };

  /**
   *
   * @param {(conversation?: Conversation) => any} callback
   */
  onReceiceCurrentConversation = (callback) => {
    this.socket.on(SocketEventEnum.SV_SEND_CURR_CONVERSATION, callback);
  };

  /**
   * handle message that you've just sent to the room
   * @param {(message: string) => any} callback
   */
  onReceiveJustSentMessage = (callback) => {
    this.socket.on(SocketEventEnum.SV_SEND_MESSAGE_TO_AUTHOR, callback);
  };

  /**
   * handle any other incoming messages
   * @param {(message: string) => any} callback
   */
  onReceiveMessageOfOthers = (callback) => {
    this.socket.on(SocketEventEnum.SV_SEND_MESSAGE, callback);
  };

  /**
   * destroy all listeners -
   * this function runs synchronously
   */
  destroyAllListeners = () => {
    this.socket.offAny();
  };
}

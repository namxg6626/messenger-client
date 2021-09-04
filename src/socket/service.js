import io from 'socket.io-client';
import { TypeConversation } from './constants';
import { SocketEventEnum } from './events';
import '@models/index';
import _ from 'lodash';

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
   * @param {(conversations: Conversation[]) => any} callback
   */
  clientFetchConversations = (callback) => {
    this.socket.emit(SocketEventEnum.CLIENT_GET_CONVERSATIONS);
    this.socket.on(SocketEventEnum.SV_SEND_CONVERSATIONS_OF_USER, (data) => {
      callback(data);
    });
  };

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
      members: [this.user._id, to],
    });
  };

  /**
   *
   * @param {string} title name of the conversation
   * @param {string} from id of the creator
   * @param {Array<string>} members list of members will be added
   */
  clientCreateGroupConversation = (title, members) => {
    this.socket.emit(SocketEventEnum.CLIENT_CREATE_CONVERSATION, {
      typeConversation: TypeConversation.GROUP,
      title,
      from: this.user._id,
      to: null,
      members: _.uniq([...members, this.user._id]),
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
   * @param {string} roomId
   */
  clientJoinRoom = (roomId) => {
    this.socket.emit(SocketEventEnum.CLIENT_JOIN_ROOM, { roomId });
  };

  /**
   *
   * @param {(conversation?: Conversation) => any} callback
   */
  onReceiveCurrentConversation = (callback) => {
    this.socket.on(SocketEventEnum.SV_SEND_CURR_CONVERSATION, callback);
  };

  /**
   *
   * @param {(conversations?: Conversation[]) => any} callback
   */
  onReceiveAllAvailableConversations = (callback) => {
    this.socket.on(SocketEventEnum.SV_SEND_CONVERSATIONS, callback);
  };

  /**
   * handle message that you've just sent to the room
   * @param {(data: {
   *  conversation: Conversation;
   *  fromUser: User;
   *  message: Message
   * }) => any} callback
   */
  onReceiveJustSentMessage = (callback) => {
    this.socket.on(SocketEventEnum.SV_SEND_MESSAGE_TO_AUTHOR, callback);
  };

  /**
   * @param {({ fromUser: User, conversation: Conversation, message: Message }) => any} callback
   * @param {string?} filterByConversationId
   * fires the callback if this param equals **message's conversationId**
   * - falsy value means disable this feature
   */
  onReceiveOthersMessage = (callback, filterByConversationId = null) => {
    this.socket.on(SocketEventEnum.SV_SEND_MESSAGE, (data) => {
      console.log(`data`, data);
      if (filterByConversationId && data.conversation._id === filterByConversationId) {
        callback(data);
      }

      if (!filterByConversationId) {
        callback(data);
      }
    });
  };

  /**
   * destroy all listeners -
   * this function runs synchronously
   */
  destroyAllListeners = () => {
    this.socket.offAny();
  };

  /**
   * destroy a listener
   * @param {(...args?: any[]) => any} handler
   */
  destroyListener = (handler) => {
    this.socket.offAny(handler);
  };
}

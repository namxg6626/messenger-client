export const SocketEventEnum = {
  ERROR: 'error',
  CONNECT_ERROR: 'connect_error',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  SV_SEND_CURR_USER: 'server-send-current-user',
  SV_SEND_USERS_ONLINE: 'server-send-users-online',
  SV_SEND_CONVERSATIONS: 'server-send-conversations',
  SV_SEND_CONVERSATIONS_OF_USER: 'server-send-conversations-of-user',
  SV_SEND_CURR_CONVERSATION: 'server-send-current-conversation',
  SV_SEND_MESSAGE: 'server-send-message',
  SV_SEND_MESSAGE_TO_AUTHOR: 'server-send-message-to-author',
  SV_SEND_LEAVE_CONVERSATION: 'server-send-leave-conversation',
  SV_SEND_LEAVE_CONVERSATION_TO_USER: 'server-send-leave-conversation-to-user',
  CLIENT_JOIN_ROOM: 'client-join-room',
  CLIENT_SEND_MESSAGE: 'client-send-message',
  CLIENT_GET_CONVERSATIONS: 'client-get-conversations',
  CLIENT_CREATE_CONVERSATION: 'client-create-conversation',
  CLIENT_LEAVE_CONVERSATION: 'client-leave-conversation',
};

export const SocketErrorMessage = {
  CREATE_CONVERSATION: 'Create new conversation',
  CLIENT_DISCONNECT: 'Client disconnect',
  SEND_MESSAGE: 'Send message',
  JOIN_ROOM: 'Join room',
  LEAVE_CONVERSATION: 'Leave conversation',
};

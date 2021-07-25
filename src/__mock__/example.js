const currentUser = {};
const chatInput = {};
const conversation = {
  _id: 'string',
  typeConversation: 'private', // enum: private | group,
  name: '',
  from: '',
  to: '',
  members: ['string'],
  newMessage: {
    messageId: 'string',
    content: '',
  },
};

// send a message
const _sendMessageBody = {
  conversationId: 'string',
  fromId: currentUser.userId,
  message: chatInput.value,
};

// after sending the message above, both receiver and sender will receive this json from server
const _socketMessageBody = {
  conversationId: 'conversation.id',
  fromId: currentUser.userId,
  message: 'string',
  fromUser: 'userObject',
  conversation: conversation,
  createAt: 'dateobj',
  _id: 'string',
};

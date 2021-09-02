import '@models/index';

export const getShortName = (name = '') => {
  const splitedName = name.split(' ');

  if (splitedName.length === 1) return splitedName[0].slice(0, 2);

  return splitedName.map((w) => w.charAt(0)).join('');
};

/**
 *
 * @param {Conversation} conversation
 * @param {string} userId
 */
export const getConversationName = (conversation, userId) => {
  return conversation.typeConversation === 'private'
    ? conversation.members.find((m) => m._id !== userId).displayname
    : conversation.title;
};

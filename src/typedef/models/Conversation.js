/**
 * @typedef {Object} Conversation
 * @property {string} _id
 * @property {'group' | 'private'} typeConversation
 * @property {string} title
 * @property {string} from
 * @property {string} to
 * @property {Array<{
 *    _id: string;
 *    displayname: string;
 * }>} members
 * @property {{
 *    messageId: string;
 *    content: string
 * }} newMessage
 */

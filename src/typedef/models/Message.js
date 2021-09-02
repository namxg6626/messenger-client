/**
 *
 * @typedef {Object} Message
 * @property {string} _id
 * @property {string} conversationId
 * @property {{
 *      userId: string;
 *      displayname: string;
 * }} author
 * @property {{
 *      type: 'text' | 'image' | 'file';
 *      body: string;
 *      fileName: string;
 * }} payload
 * @property {boolean} isOnline
 * @property {string} updatedAt
 * @property {string} createdAt
 */

import { v4 } from 'uuid';
import { loremIpsum } from 'lorem-ipsum';

const conversation = [
  {
    _id: v4(),
    avatar: 'https://i.pravatar.cc/100',
    lastMessage: loremIpsum(),
    from: loremIpsum({ count: 2, format: 'plain', units: 'words' }),
  },
  {
    _id: v4(),
    avatar: 'https://i.pravatar.cc/100',
    lastMessage: loremIpsum(),
    from: loremIpsum({ count: 3, format: 'plain', units: 'words' }),
  },
  {
    _id: v4(),
    lastMessage: loremIpsum(),
    from: loremIpsum({ count: 1, format: 'plain', units: 'words' }),
  },
  {
    _id: v4(),
    avatar: 'https://i.pravatar.cc/100',
    lastMessage: loremIpsum(),
    from: loremIpsum({ count: 3, format: 'plain', units: 'words' }),
  },
  {
    _id: v4(),
    lastMessage: loremIpsum(),
    from: loremIpsum({ count: 2, format: 'plain', units: 'words' }),
  },
  {
    _id: v4(),
    avatar: 'https://i.pravatar.cc/100',
    lastMessage: loremIpsum(),
    from: loremIpsum({ count: 2, format: 'plain', units: 'words' }),
  },
];

export default conversation;

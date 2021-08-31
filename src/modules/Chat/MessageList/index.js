import { MessageCard } from '@components/MessageCard';
import { getShortName } from '@utils/getters';
import { useSelector } from 'react-redux';
import '@models/index';

/**
 * @param {{ messages: Message[] }} props
 */
export const MessagesList = ({ messages }) => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.data.userId;

  return (
    <div>
      {messages.map((msg) => {
        const isMe = msg.author.userId === userId;
        const avatarString = getShortName(msg.author.displayname);

        return (
          <MessageCard key={msg._id} message={msg.payload.body} me={isMe} avatar={avatarString} />
        );
      })}
    </div>
  );
};

// MessagesList.whyDidYouRender = {
//   customName: 'test',
//   logOnDifferentValues: true,
// };

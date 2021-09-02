import { MessageCard } from '@components/MessageCard';
import { getShortName } from '@utils/getters';
import { useSelector } from 'react-redux';
import '@models/index';
import _ from 'lodash';
import dayjs from 'dayjs';

/**
 * @param {{
 *  messages: Message[],
 *  onReachTop: (e: React.WheelEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => any
 * }} props
 */
export const MessagesList = ({ messages, onReachTop = () => null }) => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.data.userId;

  return (
    <>
      {_.orderBy(messages, (m) => dayjs(m.createdAt).toDate(), 'asc').map((msg) => {
        const isMe = msg.author.userId === userId;
        const avatarString = getShortName(msg.author.displayname);

        return (
          <MessageCard key={msg._id} message={msg.payload.body} me={isMe} avatar={avatarString} />
        );
      })}
    </>
  );
};

// MessagesList.whyDidYouRender = {
//   customName: 'test',
//   logOnDifferentValues: true,
// };

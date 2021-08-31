import { useCallback, useContext, useEffect, useState } from 'react';

import { MessageCard } from '@components/MessageCard';
import { getShortName } from '@utils/getters';
import { useSelector } from 'react-redux';
import SocketContext from '@socket/SocketReactContext';
import _ from 'lodash';

export const MessagesList = () => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.data.userId;
  const { socketService } = useContext(SocketContext);

  /** @type {[Message[], (messages: Messages[]) => any]} */
  const [messages, setMessages] = useState([]);

  const handleReceiveMessage = useCallback(({ conversation, fromUser, message }) => {
    setMessages((curr) => [...curr, _.omit(message, 'createdAt', 'updatedAt')]);
  }, []);

  useEffect(() => {
    socketService.onReceiveJustSentMessage(handleReceiveMessage);

    socketService.onReceiveOthersMessage(handleReceiveMessage);

    return () => {
      socketService.destroyListener(handleReceiveMessage);
    };
  }, [handleReceiveMessage, socketService]);

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

MessagesList.whyDidYouRender = {
  customName: 'test',
  logOnDifferentValues: true,
};

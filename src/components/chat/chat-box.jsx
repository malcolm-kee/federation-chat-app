import PropTypes from 'prop-types';
import * as React from 'react';
import { useSocket } from '../../hooks/use-socket';
import { Alert } from '../alert';
import { Spinner } from '../spinner';
import styles from './chat-box.module.css';
import { ChatHistory } from './chat-history';
import { ChatInput } from './chat-input';
import { ChatMessage } from './chat-message';
import { ChatSystemMessage } from './chat-system-message';
import { useGlobalChatRoom } from './chat.queries';

const DEFAULT_CHAT_SOCKET_URL = 'wss://ecomm-service.herokuapp.com';

export const ChatBox = ({
  height = 400,
  socketEndpoint = DEFAULT_CHAT_SOCKET_URL,
  userId,
}) => {
  const globalChat = useGlobalChatRoom();
  const [messages, setMessages] = React.useState([]);
  const [status, send] = useSocket(
    globalChat.data ? `${socketEndpoint}?roomId=${globalChat.data._id}` : null,
    {
      onMessage: (data) => {
        setMessages((msgs) => msgs.concat(data));
        if (data.type === 'System') {
          globalChat.refetch({
            force: true,
          });
        }
      },
    }
  );

  return (
    <div className={styles.root}>
      {status === 'initializing' ? (
        <Spinner className={styles.spinner} />
      ) : status === 'error' ? (
        <Alert color="danger">Fail to connect. Please try again</Alert>
      ) : null}
      <ChatHistory height={height}>
        {messages.map((message, i) => {
          if (message.type === 'System') {
            return (
              <ChatSystemMessage key={i}>{message.message}</ChatSystemMessage>
            );
          }

          const isMe = message.data.senderId === userId;
          const sender = isMe
            ? undefined
            : globalChat.data.participants.find(
                (p) => p._id === message.data.senderId
              );

          return (
            <ChatMessage
              message={message.message}
              sendTime={message.data.createdAt}
              sender={sender && sender.name}
              isMe={isMe}
              key={i}
            />
          );
        })}
      </ChatHistory>
      <ChatInput
        onSend={(message) => {
          send({
            senderId: userId,
            content: message,
          });
        }}
        disabled={status !== 'connected'}
      />
    </div>
  );
};

ChatBox.propTypes = {
  socketEndpoint: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  height: PropTypes.number,
};

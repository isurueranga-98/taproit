import { io, Socket } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import { TMessage } from '../types';
import { UserTypes } from '../enums';

export const useChatWindow = () => {
  const getRandomUUID = () => {
    return crypto.randomUUID();
  };

  const [inputMessage, setInputMessage] = useState<string>('');
  const [thinking, setThinking] = useState<boolean>(false);
  const [maximized, setMaximized] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversationId, setConversationId] = useState<string>(getRandomUUID());

  const messagesRef = useRef<HTMLDivElement>(null);

  const botThinkingMessage = {
    id: `${getRandomUUID()}-${UserTypes.BOT}`,
    sender: UserTypes.BOT,
    text: 'Thinking...',
  };

  const botLoadingMessage = {
    id: `${getRandomUUID()}-${UserTypes.BOT}`,
    sender: UserTypes.BOT,
    text: 'Hang on, Loading Conversation...',
  };

  const onNewChat = () => resetConversation(getRandomUUID());

  const resetConversation = (newConversationId: string) => {
    setConversationId(newConversationId);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (!inputMessage) return;
    if (!socket) return;

    const messageData = {
      query: inputMessage,
      conversation_id: conversationId,
    };
    console.log(messageData);
    socket.emit('chat', messageData);

    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: `${getRandomUUID()}-${UserTypes.USER}`,
        text: inputMessage,
        sender: UserTypes.USER,
      },
    ]);

    setThinking(true);
    setInputMessage('');
  };

  useEffect(() => {
    if (!conversationId) {
      console.log('No conversation ID');
      return;
    }

    const socketInstance = io('http://127.0.0.1:8000');
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected", socketInstance);
      setSocket(socketInstance);
    });

    socketInstance.emit('join', { conversation_id: conversationId });

    socketInstance.on('response', data => {
      if (data.id && data.data !== undefined) {
        setMessages(prevMessages => {
          // Check if the message with the same id already exists
          const messageIndex = prevMessages.findIndex(msg => msg.id === data.id);

          if (messageIndex !== -1) {
            if (data.is_streaming) {
              const updatedMessages = [...prevMessages];
              updatedMessages[messageIndex] = {
                ...updatedMessages[messageIndex],
                text: updatedMessages[messageIndex].text + data.data,
              };

              return updatedMessages;
            }
            return prevMessages;
          } else {
            return [
              ...prevMessages,
              {
                id: data.id,
                text: data.data,
                sender: UserTypes.BOT,
              },
            ];
          }
        });
        setThinking(false);
      } else {
        console.log('Data received but missing "id" or "data" property:', data);
      }
    });

    // Cleanup function: disconnect the socket when the effect unmounts or conversationId changes
    return () => {
      socketInstance.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    resetConversation,
    botThinkingMessage,
    botLoadingMessage,
    onNewChat,
    maximized,
    setMaximized,
    messagesRef,
    thinking,
  };
};

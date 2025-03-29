import React from 'react';
//import { MemoizedMarkdown } from './Markdown';
import { TMessage } from '../types';
import { UserTypes } from '../enums';

const BotMessage: React.FC<{ message: TMessage }> = ({ message }) => {
    if (message.sender !== UserTypes.BOT) {
        return null;
    }

    return (
        <div className="w-auto max-w-full self-start inline-block text-left mx-2 my-2 bg-gray-100 rounded-lg p-4 shadow">
            {message.text} 
        </div>
    );
};

export default BotMessage;

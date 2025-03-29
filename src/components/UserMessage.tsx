import React from 'react';
//import { MemoizedMarkdown } from './Markdown';
import { TMessage } from '../types';
import { UserTypes } from '../enums';

const UserMessage: React.FC<{ message: TMessage }> = ({ message }) => {
    if (message.sender !== UserTypes.USER) {
        return null;
    }

    return (
        <div className="flex justify-end items-start w-full px-2 py-1">
            <div className="inline-block text-white text-right bg-gradient-to-r from-[#01AEEA] to-[#005494] rounded-lg p-4 shadow">
                {message.text} 
            </div>
        </div>
    );
};

export default UserMessage;

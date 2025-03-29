import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import { useChatWindow } from "../hooks";
import { UserTypes } from "../enums";
import sendIcon from '../assets/send-icon.svg';



const ChatWindow = () => {
    const {
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
    } = useChatWindow();

    return (<div className="fixed  bg-white shadow-lg rounded-lg flex flex-col z-[9999]">
        <div className="bg-gradient-to-r from-[#01AEEA] to-[#005494] text-white p-2 flex items-center justify-between rounded-lg">
            <div className="flex items-center">

                <div className="flex flex-col">
                    <div className="text-xs self-start">Chat with</div>
                    <div className="text-sm font-bold">AMP Assistant</div>
                </div>
            </div>
        </div>
        <div className="flex flex-grow overflow-hidden">

            {/* Chat content */}
            <div className={`flex flex-1 flex-col overflow-y-auto ${maximized ? '' : 'w-full'}`}>
                {messages.map((message) =>
                    message.sender === UserTypes.BOT ? (
                        <div key={message.id} className="flex flex-col gap-3">
                            <BotMessage message={message} />

                        </div>
                    ) : (
                        <UserMessage key={message.id} message={message} />
                    )
                )}
                {thinking && <BotMessage message={botThinkingMessage} />}
                <div ref={messagesRef} />
            </div>
        </div>
                    {/* Input field and send button row */}
                    <div className="flex items-center p-2">
                <div className="flex items-center flex-grow bg-white">
                    <input
                        className="w-full p-2 rounded-full"
                        type="text"
                        placeholder="Ask your question here..."
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleSendMessage();
                        }}
                    />
                </div>
                <button
                    onClick={handleSendMessage}
                    className="ml-2 bg-gradient-to-r from-[#01AEEA] to-[#005494] h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
                >
                    <img src={sendIcon} alt="Send" className="h-7 w-7 text-white" />
                </button>
            </div>
    </div>);
};

export { ChatWindow };



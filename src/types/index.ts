export enum UserTypes {
    USER = 'user',
    BOT = 'bot',
}

export type TMessage = {
    id: string;
    text: string;
    sender: UserTypes;
};

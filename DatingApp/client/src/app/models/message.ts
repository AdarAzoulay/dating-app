//1 to do things a bit faster we'll copy from postman a message generate an interface using http://json2ts.com/

export interface Message {
    id: number;
    senderId: number;
    senderUsername: string;
    senderPhotoUrl?: string;
    recipientId: number;
    recipientUsername: string;
    recipientPhotoUrl?: string;
    content: string;
    dateRead?: Date;
    messageSent: Date;
}






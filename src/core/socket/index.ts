import { listen } from "socket.io"
import http from 'http';

//TODO Socket.io ...
export default (http: http.Server) => {
    const io = listen(http);

    io.on("connection", function(socket: any) {
        console.log("Connection")

        interface IUser {
            id: string;
            email: string;
            fullname: string;
            lastSeen: string;
        }

        interface IDialog {
            id: string;
            author: string;
            partner: string;
            lastMessage: string;
        }

        interface IMessage {
            id: string;
            text: string;
            reader: boolean;
            lastSeen: string;
            dialog: string;
            user: string;
        }

        const dialog: IDialog = {
            id: "string",
            author: "string",
            partner: "string",
            lastMessage: "string",
        };

        const user: IUser = {
            id: "string",
            email: "string",
            fullname: "string",
            lastSeen: "string",
        };

        const message: IMessage = {
            id: "string",
            text: "string",
            reader: true,
            lastSeen: "string",
            dialog: "string",
            user: "string",
        };

        // socket.emit("SERVER:MESSAGE_NEW", message);
        socket.on("USER:MESSAGE_NEW", (message: any) => {
            // MessageController.create(userId, text, dialog_id)
            console.log("message :", message)
        });

        socket.emit("SERVER:MESSAGE_DELETE", message);

        socket.emit("SERVER:DIALOG_NEW", dialog);

        socket.emit("SERVER:USER_NEW", dialog || user);

        socket.on("MESSAGE_NEW", (data: any) => {
            data.userId
            data.dialogId
        });

        socket.on("connect", (data: any) => {
            console.log("connect", data)
        });

        socket.on("connection", (data: any) => {
            console.log("connection", data)
        });

        socket.on("send_message", (data: any) => {
            console.log("connect 2", data)
        });

        socket.on("disconnect", (data: any) => {
            console.log("MY disconnect command", data)
        });

        socket.on("DIALOGS:JOIN", (dialogId: string) => {
            socket.dialogId = dialogId;
            socket.join(dialogId);
        });
        socket.on("DIALOGS:TYPING", (obj: any) => {
            socket.broadcast.emit("DIALOGS:TYPING", obj);
        });
    });

    return io;
};
import { listen } from "socket.io"
import http from 'http';

//TODO Socket.io ...
export default (http: http.Server) => {
    const io = listen(http);

    io.on('connection', function(socket: any) {
        console.log("Connection")

            socket.emit("send_message", "string");

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


        socket.on('DIALOGS:JOIN', (dialogId: string) => {
            socket.dialogId = dialogId;
            socket.join(dialogId);
        });
        socket.on('DIALOGS:TYPING', (obj: any) => {
            socket.broadcast.emit('DIALOGS:TYPING', obj);
        });
    });

    return io;
};
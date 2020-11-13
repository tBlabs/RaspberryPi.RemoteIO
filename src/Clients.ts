import { Socket } from "socket.io";

export class Clients
{
    private clients: Socket[] = [];

    public Add(socket: Socket): void
    {
        console.log('Client connected', socket.id);

        this.clients.push(socket);

        socket.on('disconnect', () =>
        {
            console.log('Client disconnected', socket.id);
            this.Remove(socket);
        });
    }

    public Remove(socket: Socket): void
    { 
        const clientIndex = this.clients.indexOf(socket);

        this.clients.splice(clientIndex, 1);
    }

    public SendToAll(event: string, ...args: any[]): void
    {
        // console.log('STA', this.clients.length);
        this.clients.forEach((socket: Socket) =>
        {
            // console.log('sending to', socket.id);
            socket.emit(event, ...args);
        });
    }

    public DisconnectAll(): void
    {
        this.clients.forEach((socket: Socket) =>
        {
            socket.disconnect();
        });
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clients = void 0;
class Clients {
    constructor() {
        this.clients = [];
    }
    Add(socket) {
        this.clients.push(socket);
        socket.on('disconnect', () => {
            this.Remove(socket);
        });
    }
    Remove(socket) {
        const clientIndex = this.clients.indexOf(socket);
        this.clients.splice(clientIndex, 1);
    }
    SendToAll(event, ...args) {
        this.clients.forEach((socket) => {
            socket.emit(event, ...args);
        });
    }
    DisconnectAll() {
        this.clients.forEach((socket) => {
            socket.disconnect();
        });
    }
}
exports.Clients = Clients;
//# sourceMappingURL=Clients.js.map
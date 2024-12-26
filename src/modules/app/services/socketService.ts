import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;

    // Initialize the socket connection
    public connect(url: string): void {
        if (!this.socket) {
            this.socket = io(url);
            this.setupListeners();
        }
    }

    // Setup listeners for socket events
    private setupListeners(): void {
        if (this.socket) {
            this.socket.on('connect', () => {
                console.log('Connected to socket server');
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from socket server');
            });

            // Add more event listeners as needed
        }
    }

    // Emit an event to the server
    public emit(event: string, data: any): void {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    // Listen for an event from the server
    public on(event: string, callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    // Remove a specific event listener
    public off(event: string): void {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    // Disconnect the socket
    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();
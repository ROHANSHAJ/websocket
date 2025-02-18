const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 5500 });

wss.on("connection", ws => {
    console.log(`New client connected, Total clients: ${wss.clients.size}`);

    // Send welcome message
    ws.send("Welcome to WebSocket server");

    // Broadcast received messages to all connected clients
    ws.on("message", (message) => {
        console.log(`Received from client: ${message}`);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`server response you sent ->: ${message}`);
            }
        });
    });

    // Periodic client count update
    const interval = setInterval(() => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Total clients in server: ${wss.clients.size}`);
            }
        });
    },30000);

    // Handle client disconnection
    ws.on("close", () => {
        clearInterval(interval);
        console.log(`Client disconnected, Total clients: ${wss.clients.size}`);
    });
});

console.log("WebSocket server running on ws://localhost:5500");
const WebSocket = require("ws"); 
// Use the environment port if available, otherwise default to 80
const port = process.env.PORT || 80;
const wss = new WebSocket.Server({ port });

wss.on("connection", ws => {
    console.log(`New client connected, Total clients: ${wss.clients.size}`);

    // Send welcome message
    ws.send("Welcome to WebSocket server");

    // Broadcast received messages to all connected clients
    ws.on("message", (message) => {
        console.log(`Received from client: ${message}`);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Server response: You sent -> ${message}`);
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
    }, 30000);

    // Handle client disconnection
    ws.on("close", () => {
        clearInterval(interval);
        console.log(`Client disconnected, Total clients: ${wss.clients.size}`);
    });

    // Handle unexpected errors
    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });
});

// Handle WebSocket server errors
wss.on("error", (err) => {
    console.error("WebSocket server error:", err);
});

console.log(`WebSocket server running on ws://localhost:${port}`);

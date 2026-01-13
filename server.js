const express = require("express");
const { WebSocketServer } = require("ws");
const http = require("http");

const app = express();
const port = process.env.PORT || 3000;

// Servidor HTTP normal
const server = http.createServer(app);

// Servidor WebSocket sobre el mismo HTTP
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");

  ws.on("message", (msg) => {
    console.log("Received from client:", msg.toString());
    ws.send(JSON.stringify({ type: "echo", data: msg.toString() }));
  });

  ws.on("close", () => console.log("Client disconnected"));
  ws.on("error", (err) => console.error("WebSocket error:", err));

  // Mensaje inicial de conexión
  ws.send(JSON.stringify({ type: "connected", message: "WS Ready" }));
});

// Solo para verificar que el servidor HTTP funciona
app.get("/", (req, res) => res.send("Hello, this is your WebSocket server!"));

// Levantar servidor
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

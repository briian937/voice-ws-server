const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");

  ws.send(JSON.stringify({
    type: "connected",
    message: "WebSocket server is working"
  }));

  ws.on("message", (message) => {
    console.log("📩 Message received:", message.toString());

    ws.send(JSON.stringify({
      type: "echo",
      data: message.toString()
    }));
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

app.get("/", (req, res) => {
  res.send("WebSocket server running");
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});


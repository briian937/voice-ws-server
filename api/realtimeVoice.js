import { WebSocketServer } from 'ws';

export const config = {
  runtime: 'edge', // Vercel Edge Function
};

export default async function handler(req) {
  if (req.headers.get('upgrade') !== 'websocket') {
    return new Response('Expected WebSocket', { status: 426 });
  }

  const { socket, response } = new WebSocketServer({ noServer: true }).handleUpgrade(
    req,
    req.socket,
    Buffer.alloc(0),
    (ws) => {
      ws.on('message', (msg) => {
        console.log('Message from client:', msg.toString());
        ws.send(JSON.stringify({ type: 'echo', data: msg.toString() }));
      });

      ws.on('close', () => {
        console.log('Client WebSocket closed');
      });

      ws.on('error', (err) => {
        console.error('WebSocket error:', err);
      });

      // Send initial connection message
      ws.send(JSON.stringify({ type: 'connected', message: 'WS Ready' }));
    }
  );

  return response;
}


import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeWebSocketServer, broadcastMessage, getConnectedClientsCount } from './src/lib/websocket';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const parsedUrl = parse(req.url!, true);
      
      // Handle broadcast endpoint directly
      if (parsedUrl.pathname === '/api/broadcast' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            
            // Broadcast message to all connected WebSocket clients
            broadcastMessage({
              type: 'broadcast',
              data: data,
              timestamp: new Date().toISOString()
            });
            
            res.writeHead(200, {
              'Content-Type': 'application/json',
              ...corsHeaders,
            });
            res.end(JSON.stringify({
              success: true,
              message: 'Message broadcasted to all connected clients',
              connectedClients: getConnectedClientsCount(),
              data: data
            }));
          } catch (error) {
            res.writeHead(400, {
              'Content-Type': 'application/json',
              ...corsHeaders,
            });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }
      
      // Handle OPTIONS for CORS preflight
      if (parsedUrl.pathname === '/api/broadcast' && req.method === 'OPTIONS') {
        res.writeHead(200, corsHeaders);
        res.end();
        return;
      }
      
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize WebSocket server
  initializeWebSocketServer(server);

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket server running on ws://${hostname}:${port}`);
  });
}); 
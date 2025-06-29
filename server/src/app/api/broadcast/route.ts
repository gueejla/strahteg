import { NextRequest, NextResponse } from 'next/server';
import { broadcastMessage, getConnectedClientsCount } from '../../../lib/websocket';

// This endpoint allows broadcasting messages to all connected WebSocket clients
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Broadcast message to all connected WebSocket clients
    broadcastMessage({
      type: 'broadcast',
      data: body,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message broadcasted to all connected clients',
      connectedClients: getConnectedClientsCount(),
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' }, 
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Broadcast endpoint is running',
    connectedClients: getConnectedClientsCount(),
    usage: 'Send POST requests with JSON body to broadcast to WebSocket clients'
  });
} 
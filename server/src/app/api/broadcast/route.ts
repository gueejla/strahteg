import { NextRequest, NextResponse } from 'next/server';
import { broadcastMessage, getConnectedClientsCount } from '../../../lib/websocket';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// This endpoint allows broadcasting messages to all connected WebSocket clients
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get current connected clients count before broadcasting
    const clientCount = getConnectedClientsCount();
    
    // Broadcast message to all connected WebSocket clients
    broadcastMessage({
      type: 'broadcast',
      data: body,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message broadcasted to all connected clients',
      connectedClients: clientCount,
      data: body
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Broadcast API error:', error);
    return NextResponse.json(
      { error: 'Invalid request body' }, 
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Broadcast endpoint is running',
    connectedClients: getConnectedClientsCount(),
    usage: 'Send POST requests with JSON body to broadcast to WebSocket clients'
  }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { headers: corsHeaders }
  )
} 
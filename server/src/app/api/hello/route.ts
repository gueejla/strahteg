import { NextResponse } from 'next/server'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET() {
  return NextResponse.json(
    { message: 'Hello World' },
    { headers: corsHeaders }
  )
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { headers: corsHeaders }
  )
} 
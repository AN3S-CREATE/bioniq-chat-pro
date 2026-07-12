import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await prisma.chatMessage.findMany({
      where: { threadId: id },
      orderBy: { timestamp: 'asc' },
    });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { text, sender } = await req.json(); // sender should be 'agent'

    if (!text) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        threadId: id,
        sender: sender || 'agent',
        text,
        status: 'sent',
      },
    });

    // Update last bot/agent response in thread, increment count, and set status to active
    await prisma.chatThread.update({
      where: { id },
      data: {
        lastBotResponse: text,
        messageCount: { increment: 1 },
        status: 'active',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

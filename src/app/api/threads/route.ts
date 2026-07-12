import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const threads = await prisma.chatThread.findMany({
      include: {
        customer: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(threads);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

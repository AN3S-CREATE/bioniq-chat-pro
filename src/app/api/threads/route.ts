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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

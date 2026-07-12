import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { phone, name } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // 1. Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          name: name || 'New Customer',
          phone,
          email: `${phone.replace(/[^0-9]/g, '')}@bioniq-temp.co.za`,
          status: 'pending',
          internetPlan: 'Pending Setup',
          address: 'Not Provided',
        },
      });
    }

    // 2. Find active thread or create one
    let thread = await prisma.chatThread.findFirst({
      where: {
        customerId: customer.id,
        status: { in: ['active', 'waiting', 'escalated'] },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (!thread) {
      thread = await prisma.chatThread.create({
        data: {
          customerId: customer.id,
          status: 'active',
          botConfidence: 'high',
          messageCount: 0,
        },
      });
    }

    // 3. Return customer + thread info + message history
    const messages = await prisma.chatMessage.findMany({
      where: { threadId: thread.id },
      orderBy: { timestamp: 'asc' },
    });

    return NextResponse.json({
      customer,
      threadId: thread.id,
      messages,
    });
  } catch (error: any) {
    console.error('Error starting conversation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

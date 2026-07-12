import { NextResponse } from 'next/server';
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import prisma from '@/lib/db';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { message, threadId, customerId } = await req.json();

    if (!message || !threadId || !customerId) {
      return NextResponse.json({ error: 'Message, threadId, and customerId are required' }, { status: 400 });
    }

    // 1. Save user message to database
    await prisma.chatMessage.create({
      data: {
        threadId,
        sender: 'user',
        text: message,
        status: 'read',
      },
    });

    // 2. Fetch recent conversation history from DB for LLM context
    const recentMessages = await prisma.chatMessage.findMany({
      where: { threadId },
      orderBy: { timestamp: 'asc' },
      take: 20, // last 20 messages
    });

    const llmMessages = recentMessages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.text,
    }));

    // 3. Define prompt & agent description
    const systemPrompt = `You are a professional WhatsApp customer support agent for Bioniq, a South African Internet Service Provider (ISP) offering unrestricted uncapped internet solutions in Steve Tshwete, Mpumalanga. Your role is to:
1. Answer customer inquiries about internet packages, pricing, speed limits, and coverage
2. Help customers schedule fiber and hardware installation appointments
3. Track and update hardware orders (routers, mesh extenders)
4. Resolve technical, billing, and connectivity support tickets
5. Recommend suitable internet plans and hardware upgrades based on customer needs

You have access to tools to query and update the database (Customer profiles, Product inventory, Appointments, Support tickets, Orders).
Always be professional, helpful, and responsive. Provide accurate information. If you need to create appointments, orders, or support tickets, use the available tools. Keep responses concise and friendly for WhatsApp messaging.

State and currency details:
- Prices and fees are in South African Rand (ZAR).
- Coverage area is Steve Tshwete, Mpumalanga.
- Customer ID: ${customerId}
- Chat Thread ID: ${threadId}`;

    // Check for API key
    const hasOpenAiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key';

    if (hasOpenAiKey) {
      // Run real OpenAI model with tools
      const result = await streamText({
        model: openai('gpt-4o-mini'),
        system: systemPrompt,
        messages: llmMessages,
        tools: {
          getCustomerInfo: tool({
            description: 'Get customer profile and subscription info',
            inputSchema: z.object({}),
            execute: async () => {
              const customer = await prisma.customer.findUnique({
                where: { id: customerId },
              });
              return customer || { error: 'Customer not found' };
            },
          }),
          getInventory: tool({
            description: 'Get product inventory, prices, and stock availability',
            inputSchema: z.object({}),
            execute: async () => {
              const products = await prisma.product.findMany();
              return products;
            },
          }),
          getHardwareOrders: tool({
            description: 'Retrieve order history for the customer',
            inputSchema: z.object({}),
            execute: async () => {
              const orders = await prisma.order.findMany({
                where: { customerId },
              });
              return orders;
            },
          }),
          getSupportTickets: tool({
            description: 'Retrieve support tickets history for the customer',
            inputSchema: z.object({}),
            execute: async () => {
              const tickets = await prisma.supportTicket.findMany({
                where: { customerId },
              });
              return tickets;
            },
          }),
          createSupportTicket: tool({
            description: 'Create a new support ticket for the customer',
            inputSchema: z.object({
              title: z.string().describe('Short summary of the issue'),
              category: z.enum(['technical', 'billing', 'account', 'general']),
              priority: z.enum(['low', 'medium', 'high', 'critical']),
            }),
            execute: async ({ title, category, priority }) => {
              const count = await prisma.supportTicket.count();
              const ticketId = `TICKET-2024-${String(count + 1).padStart(3, '0')}`;
              const ticket = await prisma.supportTicket.create({
                data: {
                  id: ticketId,
                  customerId,
                  status: 'open',
                  priority,
                  category,
                  assignedAgent: 'Unassigned',
                },
              });
              return { success: true, ticketId: ticket.id, status: ticket.status };
            },
          }),
          bookInstallation: tool({
            description: 'Book a fiber setup or hardware installation appointment',
            inputSchema: z.object({
              type: z.enum(['fiber', 'wifi-setup', 'maintenance', 'troubleshooting']),
              dateString: z.string().describe('YYYY-MM-DD format'),
              timeSlot: z.string().describe('e.g. "09:00 - 13:00" or "14:00 - 17:00"'),
              notes: z.string().optional(),
            }),
            execute: async ({ type, dateString, timeSlot, notes }) => {
              const date = new Date(dateString);
              const appointment = await prisma.installationAppointment.create({
                data: {
                  customerId,
                  type,
                  status: 'scheduled',
                  date,
                  timeSlot,
                  technician: 'Assigned on Dispatch',
                  duration: 2.0,
                  notes,
                },
              });
              return { success: true, appointmentId: appointment.id, date: dateString, timeSlot };
            },
          }),
        },
        onFinish: async ({ text }) => {
          // Save final bot message
          await prisma.chatMessage.create({
            data: {
              threadId,
              sender: 'bot',
              text,
              status: 'read',
            },
          });
          // Update thread message count and last response
          await prisma.chatThread.update({
            where: { id: threadId },
            data: {
              messageCount: { increment: 1 },
              lastBotResponse: text,
              updatedAt: new Date(),
            },
          });
        },
      });

      return result.toTextStreamResponse();
    } else {
      // Fallback: Graceful degradation mock stream response
      // Simulates AI streaming responses with database checks
      const userText = message.toLowerCase();
      let responseText = '';
      let simulatedToolResult = '';

      if (userText.includes('plan') || userText.includes('package') || userText.includes('price')) {
        const products = await prisma.product.findMany({ where: { category: { in: ['Subscription', 'Hardware'] } } });
        responseText = `Bioniq internet plans available in Steve Tshwete:\n\n` +
          products.map(p => `📶 *${p.name}* - R${p.price}/month\n_${p.description}_`).join('\n\n') +
          `\n\nWould you like to upgrade your plan or schedule a setup?`;
      } else if (userText.includes('order') || userText.includes('track') || userText.includes('upgrade')) {
        const orders = await prisma.order.findMany({ where: { customerId } });
        if (orders.length > 0) {
          responseText = `I found your hardware order details:\n\n` +
            orders.map(o => `📦 *Order:* ${o.itemsOrdered}\n*Status:* ${o.status}\n*Total:* R${o.totalAmount}\n*Tracking:* ${o.trackingNumber || 'Pending'}`).join('\n\n');
        } else {
          responseText = `I couldn't find any recent hardware orders on your account. Would you like to order a WiFi 6 Router Upgrade (R1,200) or Mesh Extender (R800)?`;
        }
      } else if (userText.includes('ticket') || userText.includes('slow') || userText.includes('issue') || userText.includes('support')) {
        const tickets = await prisma.supportTicket.findMany({ where: { customerId } });
        if (userText.includes('slow') || userText.includes('weak') || userText.includes('broken')) {
          // Simulate ticket creation
          const count = await prisma.supportTicket.count();
          const ticketId = `TICKET-2024-${String(count + 1).padStart(3, '0')}`;
          await prisma.supportTicket.create({
            data: {
              id: ticketId,
              customerId,
              status: 'open',
              priority: 'medium',
              category: 'technical',
              assignedAgent: 'Unassigned',
            },
          });
          responseText = `🛠️ *Support Ticket Created!*\n\nI have registered a technical support ticket for your connection issue:\n*Ticket ID:* ${ticketId}\n*Status:* Open\n*Priority:* Medium\n\nOur support technician will follow up shortly.`;
        } else if (tickets.length > 0) {
          responseText = `Here are your current support tickets:\n\n` +
            tickets.map(t => `🎫 *Ticket:* ${t.id}\n*Category:* ${t.category}\n*Status:* ${t.status}\n*Priority:* ${t.priority}`).join('\n\n');
        } else {
          responseText = `No open support tickets were found for your account. If you are experiencing technical difficulties, let me know and I will create a ticket for you!`;
        }
      } else if (userText.includes('install') || userText.includes('schedule') || userText.includes('appointment')) {
        const appointments = await prisma.installationAppointment.findMany({ where: { customerId } });
        if (appointments.length > 0) {
          responseText = `I found your scheduled installation appointments:\n\n` +
            appointments.map(a => `📅 *Type:* ${a.type}\n*Status:* ${a.status}\n*Date:* ${new Date(a.date).toLocaleDateString()}\n*Time:* ${a.timeSlot}\n*Tech:* ${a.technician}`).join('\n\n');
        } else {
          // Book a mock appointment
          const appointmentDate = new Date();
          appointmentDate.setDate(appointmentDate.getDate() + 3); // 3 days from now
          const appointment = await prisma.installationAppointment.create({
            data: {
              customerId,
              type: 'wifi-setup',
              status: 'scheduled',
              date: appointmentDate,
              timeSlot: '09:00 - 13:00',
              technician: 'Alex Mthembu',
              duration: 2.0,
              notes: 'Scheduled via support bot fallback',
            },
          });
          responseText = `📅 *Appointment Booked Successfully!*\n\nI have scheduled a WiFi Setup appointment for you:\n*Date:* ${appointmentDate.toLocaleDateString()}\n*Time Slot:* 09:00 - 13:00\n*Technician:* Alex Mthembu\n\nPlease ensure someone is home during this time.`;
        }
      } else {
        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        responseText = `Hello ${customer?.name || 'there'}! 👋 I'm your Bioniq WhatsApp Support assistant.\n\nI can help you with:\n📶 Checking internet packages & speeds\n📦 Tracking hardware orders\n🛠️ Creating technical support tickets\n📅 Scheduling installation appointments\n\nHow can I assist you today?`;
      }

      // Stream the response manually to simulate LLM feel
      const encoder = new TextEncoder();
      const customReadable = new ReadableStream({
        async start(controller) {
          // Send response chunks
          const words = responseText.split(' ');
          let currentText = '';
          for (let i = 0; i < words.length; i++) {
            const delta = words[i] + (i === words.length - 1 ? '' : ' ');
            currentText += delta;
            
            // Format delta as Vercel AI SDK text-delta stream format
            // format: 0:"text"\n
            controller.enqueue(encoder.encode(`0:${JSON.stringify(delta)}\n`));
            await new Promise(r => setTimeout(r, 40));
          }

          // Save final message in database
          await prisma.chatMessage.create({
            data: {
              threadId,
              sender: 'bot',
              text: responseText,
              status: 'read',
            },
          });

          await prisma.chatThread.update({
            where: { id: threadId },
            data: {
              messageCount: { increment: 1 },
              lastBotResponse: responseText,
              updatedAt: new Date(),
            },
          });

          controller.close();
        }
      });

      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache, no-transform',
        }
      });
    }
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

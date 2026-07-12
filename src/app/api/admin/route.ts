import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');

    if (!model) {
      return NextResponse.json({ error: 'Model parameter is required' }, { status: 400 });
    }

    let data;
    switch (model) {
      case 'customers':
        data = await prisma.customer.findMany({
          orderBy: { name: 'asc' },
        });
        break;
      case 'products':
        data = await prisma.product.findMany({
          orderBy: { sku: 'asc' },
        });
        break;
      case 'orders':
        data = await prisma.order.findMany({
          include: { customer: true },
          orderBy: { orderDate: 'desc' },
        });
        break;
      case 'tickets':
        data = await prisma.supportTicket.findMany({
          include: { customer: true },
          orderBy: { createdAt: 'desc' },
        });
        break;
      case 'appointments':
        data = await prisma.installationAppointment.findMany({
          include: { customer: true },
          orderBy: { date: 'asc' },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid model parameter' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');
    const body = await req.json();

    if (!model) {
      return NextResponse.json({ error: 'Model parameter is required' }, { status: 400 });
    }

    let created;
    switch (model) {
      case 'customers':
        created = await prisma.customer.create({ data: body });
        break;
      case 'products':
        created = await prisma.product.create({ data: body });
        break;
      case 'orders':
        created = await prisma.order.create({ data: body });
        break;
      case 'tickets':
        created = await prisma.supportTicket.create({ data: body });
        break;
      case 'appointments':
        created = await prisma.installationAppointment.create({
          data: {
            ...body,
            date: new Date(body.date),
          },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid model parameter' }, { status: 400 });
    }

    return NextResponse.json(created);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');
    const id = searchParams.get('id');
    const body = await req.json();

    if (!model || !id) {
      return NextResponse.json({ error: 'Model and id parameters are required' }, { status: 400 });
    }

    let updated;
    switch (model) {
      case 'customers':
        updated = await prisma.customer.update({ where: { id }, data: body });
        break;
      case 'products':
        updated = await prisma.product.update({ where: { id }, data: body });
        break;
      case 'orders':
        updated = await prisma.order.update({ where: { id }, data: body });
        break;
      case 'tickets':
        updated = await prisma.supportTicket.update({ where: { id }, data: body });
        break;
      case 'appointments':
        updated = await prisma.installationAppointment.update({
          where: { id },
          data: {
            ...body,
            date: body.date ? new Date(body.date) : undefined,
          },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid model parameter' }, { status: 400 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');
    const id = searchParams.get('id');

    if (!model || !id) {
      return NextResponse.json({ error: 'Model and id parameters are required' }, { status: 400 });
    }

    let deleted;
    switch (model) {
      case 'customers':
        deleted = await prisma.customer.delete({ where: { id } });
        break;
      case 'products':
        deleted = await prisma.product.delete({ where: { id } });
        break;
      case 'orders':
        deleted = await prisma.order.delete({ where: { id } });
        break;
      case 'tickets':
        deleted = await prisma.supportTicket.delete({ where: { id } });
        break;
      case 'appointments':
        deleted = await prisma.installationAppointment.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ error: 'Invalid model parameter' }, { status: 400 });
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

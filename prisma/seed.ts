import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL || 'file:dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const projectsDir = path.join(process.cwd(), 'legacy', 'projects');

function readJsonFile(filename: string) {
  const filePath = path.join(projectsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function main() {
  console.log('Clearing database...');
  await prisma.user.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.chatThread.deleteMany({});
  await prisma.installationAppointment.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.customer.deleteMany({});

  console.log('Seeding admin user...');
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // 1. Seed Customers
  console.log('Seeding customers from EdTX81Qs3i4JwPxs.json...');
  const customerData = readJsonFile('EdTX81Qs3i4JwPxs.json');
  const customerMap = new Map<string, string>(); // name/phone -> id

  if (customerData) {
    const rows = customerData.root.children[0].children || [];
    for (const row of rows) {
      const name = row.text.ops[0].insert.trim();
      const attrs = row.attributes || {};

      const phone = attrs['@cust1'] || '';
      const email = attrs['@cust2'] || '';
      const status = attrs['@cust3']?.optionId || 'active';
      const internetPlan = attrs['@cust4'] || 'Unrestricted Uncapped 100Mbps';
      const joinDate = attrs['@cust5']?.dateTime?.date ? new Date(attrs['@cust5'].dateTime.date) : new Date();
      const lastContact = attrs['@cust6']?.dateTime?.date ? new Date(attrs['@cust6'].dateTime.date) : new Date();
      const address = attrs['@cust7'] || '';
      const language = attrs['@cust8']?.optionId || 'english';
      const monthlyFee = parseFloat(attrs['@cust9'] || '0');
      const whatsappId = attrs['@cus10'] || '';

      const customer = await prisma.customer.create({
        data: {
          name,
          phone,
          email,
          status,
          internetPlan,
          joinDate,
          lastContact,
          address,
          language,
          monthlyFee,
          whatsappId,
        },
      });

      customerMap.set(name, customer.id);
      customerMap.set(phone, customer.id);
      console.log(`Created customer: ${customer.name}`);
    }
  }

  // Fallback map helper
  const getCustomerId = (name: string, phone: string) => {
    if (customerMap.has(phone)) return customerMap.get(phone)!;
    if (customerMap.has(name)) return customerMap.get(name)!;
    // Return first customer or throw
    const keys = Array.from(customerMap.values());
    return keys[0] || '';
  };

  // 2. Seed Products (Inventory)
  console.log('Seeding products from HPpKWYiSMBbn6Ta8.json...');
  const productData = readJsonFile('HPpKWYiSMBbn6Ta8.json');
  if (productData) {
    const rows = productData.root.children[0].children || [];
    for (const row of rows) {
      const attrs = row.attributes || {};
      const name = attrs['@pro1'] || row.text.ops[0].insert.trim();
      const category = attrs['@pro2'] || 'Hardware';
      const price = parseFloat(attrs['@pro3'] || '0');
      const availability = attrs['@pro4']?.optionId || 'in-stock';
      const sku = attrs['@pro5'] || '';
      const description = attrs['@pro6'] || '';
      const stockQuantity = parseInt(attrs['@pro7'] || '0', 10);
      const supplier = attrs['@pro8'] || '';
      const features = attrs['@pr10'] || '';

      await prisma.product.create({
        data: {
          sku,
          name,
          category,
          price,
          availability,
          description,
          stockQuantity,
          supplier,
          features,
        },
      });
      console.log(`Created product: ${name}`);
    }
  }

  // 3. Seed Support Tickets
  console.log('Seeding tickets from NTEpfNJa25HGekRL.json...');
  const ticketData = readJsonFile('NTEpfNJa25HGekRL.json');
  if (ticketData) {
    const rows = ticketData.root.children[0].children || [];
    for (const row of rows) {
      const idStr = row.text.ops[0].insert.trim();
      // ID formats like "TICKET-2024-001: Internet speed slower..."
      const idMatch = idStr.match(/^(TICKET-\d+-\d+)/);
      const id = idMatch ? idMatch[1] : `TICKET-${Math.floor(Math.random() * 10000)}`;

      const attrs = row.attributes || {};
      const customerName = attrs['@sup1'] || '';
      const customerPhone = attrs['@sup2'] || '';
      const status = attrs['@sup3']?.optionId || 'open';
      const priority = attrs['@sup4']?.optionId || 'low';
      const category = attrs['@sup5']?.optionId || 'technical';
      const createdAt = attrs['@sup6']?.dateTime?.date ? new Date(attrs['@sup6'].dateTime.date) : new Date();
      const updatedAt = attrs['@sup7']?.dateTime?.date ? new Date(attrs['@sup7'].dateTime.date) : new Date();
      const assignedAgent = attrs['@sup8'] || '';
      const channel = attrs['@sup9']?.optionId || 'whatsapp';
      const resolutionTime = attrs['@su10'] ? parseFloat(attrs['@su10']) : null;

      const customerId = getCustomerId(customerName, customerPhone);

      await prisma.supportTicket.create({
        data: {
          id,
          customerId,
          status,
          priority,
          category,
          createdAt,
          updatedAt,
          assignedAgent,
          channel,
          resolutionTime,
        },
      });
      console.log(`Created ticket: ${id}`);
    }
  }

  // 4. Seed Installation Appointments
  console.log('Seeding appointments from S9ZKbhB6t7DYcjFt.json...');
  const appointmentData = readJsonFile('S9ZKbhB6t7DYcjFt.json');
  if (appointmentData) {
    const rows = appointmentData.root.children[0].children || [];
    for (const row of rows) {
      const attrs = row.attributes || {};
      const customerName = attrs['@ins1'] || '';
      const customerPhone = attrs['@ins2'] || '';
      const address = attrs['@ins3'] || '';
      const type = attrs['@ins4']?.optionId || 'fiber';
      const status = attrs['@ins5']?.optionId || 'scheduled';
      const date = attrs['@ins6']?.dateTime?.date ? new Date(attrs['@ins6'].dateTime.date) : new Date();
      const timeSlot = attrs['@ins7'] || '09:00 - 13:00';
      const technician = attrs['@ins8'] || '';
      const duration = attrs['@in10'] ? parseFloat(attrs['@in10']) : 2.0;
      const notes = attrs['@ins9'] || '';

      const customerId = getCustomerId(customerName, customerPhone);

      await prisma.installationAppointment.create({
        data: {
          customerId,
          type,
          status,
          date,
          timeSlot,
          technician,
          duration,
          notes,
        },
      });
      console.log(`Created appointment for: ${customerName}`);
    }
  }

  // 5. Seed Orders (Order Management)
  console.log('Seeding orders from ZGP7PY6VQiAhvEpK.json...');
  const orderData = readJsonFile('ZGP7PY6VQiAhvEpK.json');
  if (orderData) {
    const rows = orderData.root.children[0].children || [];
    for (const row of rows) {
      const idStr = row.text.ops[0].insert.trim();
      const idMatch = idStr.match(/^(BQ-\d+-\d+)/);
      const id = idMatch ? idMatch[1] : `BQ-${Math.floor(Math.random() * 100000)}`;

      const attrs = row.attributes || {};
      const itemsOrdered = attrs['@or10'] || '';
      const customerName = attrs['@ord1'] || '';
      const customerPhone = attrs['@ord2'] || '';
      const status = attrs['@ord3']?.optionId || 'pending';
      const totalAmount = parseFloat(attrs['@ord4'] || '0');
      const orderDate = attrs['@ord5']?.dateTime?.date ? new Date(attrs['@ord5'].dateTime.date) : new Date();
      const deliveryDate = attrs['@ord6']?.dateTime?.date ? new Date(attrs['@ord6'].dateTime.date) : null;
      const trackingNumber = attrs['@ord7'] || '';
      const deliveryAddress = attrs['@ord8'] || '';
      const paymentStatus = attrs['@ord9']?.optionId || 'unpaid';

      const customerId = getCustomerId(customerName, customerPhone);

      await prisma.order.create({
        data: {
          id,
          customerId,
          itemsOrdered,
          status,
          totalAmount,
          orderDate,
          deliveryDate,
          trackingNumber,
          deliveryAddress,
          paymentStatus,
        },
      });
      console.log(`Created order: ${id}`);
    }
  }

  // 6. Seed Conversations & Messages
  console.log('Seeding chat threads from FEEux561JsGo2G6G.json...');
  const convoData = readJsonFile('FEEux561JsGo2G6G.json');
  if (convoData) {
    const rows = convoData.root.children[0].children || [];
    for (const row of rows) {
      const attrs = row.attributes || {};
      const customerName = attrs['@con1'] || '';
      const customerPhone = attrs['@con2'] || '';
      const createdAt = attrs['@con3']?.dateTime?.date ? new Date(attrs['@con3'].dateTime.date) : new Date();
      const lastMessageAt = attrs['@con4']?.dateTime?.date ? new Date(attrs['@con4'].dateTime.date) : new Date();
      const status = attrs['@con5']?.optionId || 'active';
      const botConfidence = attrs['@con6']?.optionId || 'high';
      const intentCategory = attrs['@con7'] || '';
      const messageCount = parseInt(attrs['@con8'] || '0', 10);
      const lastBotResponse = attrs['@con9'] || '';
      const assignedAgent = attrs['@co10'] || '';

      const customerId = getCustomerId(customerName, customerPhone);

      const thread = await prisma.chatThread.create({
        data: {
          customerId,
          status,
          botConfidence,
          intentCategory,
          messageCount,
          lastBotResponse,
          assignedAgent,
          createdAt,
          updatedAt: lastMessageAt,
        },
      });

      // Seed mock chat messages to show in the UI
      if (customerName === 'John Doe') {
        await prisma.chatMessage.createMany({
          data: [
            {
              threadId: thread.id,
              sender: 'user',
              text: 'Hello, I\'d like to check my internet speed.',
              timestamp: new Date(createdAt.getTime() - 1000 * 60 * 5),
              status: 'read',
            },
            {
              threadId: thread.id,
              sender: 'bot',
              text: 'Hi John! I can help you with that. Let\'s check your connection.',
              timestamp: new Date(createdAt.getTime() - 1000 * 60 * 4),
              status: 'read',
            },
            {
              threadId: thread.id,
              sender: 'user',
              text: 'Great, run it now please.',
              timestamp: new Date(createdAt.getTime() - 1000 * 60 * 2),
              status: 'read',
            },
            {
              threadId: thread.id,
              sender: 'bot',
              text: 'Your current speed is 98.5 Mbps down / 45.2 Mbps up. Performance is excellent!',
              timestamp: lastMessageAt,
              status: 'read',
            },
          ],
        });
      } else if (customerName === 'Chantelle Le Roux') {
        await prisma.chatMessage.createMany({
          data: [
            {
              threadId: thread.id,
              sender: 'user',
              text: 'Hello, my WiFi connection is very weak in my bedroom.',
              timestamp: new Date(createdAt.getTime() - 1000 * 60 * 10),
              status: 'read',
            },
            {
              threadId: thread.id,
              sender: 'bot',
              text: 'I\'m sorry to hear that! What router model do you currently have?',
              timestamp: new Date(createdAt.getTime() - 1000 * 60 * 8),
              status: 'read',
            },
            {
              threadId: thread.id,
              sender: 'user',
              text: 'It is the standard fiber router.',
              timestamp: new Date(createdAt.getTime() - 1000 * 60 * 5),
              status: 'read',
            },
            {
              threadId: thread.id,
              sender: 'bot',
              text: 'I recommend upgrading to our WiFi 6 Router or adding a Mesh Extender. I\'ll connect you with our technical specialist for WiFi optimization.',
              timestamp: lastMessageAt,
              status: 'read',
            },
          ],
        });
      } else {
        await prisma.chatMessage.createMany({
          data: [
            {
              threadId: thread.id,
              sender: 'user',
              text: 'I have a billing question.',
              timestamp: new Date(createdAt.getTime() - 1000 * 60 * 5),
              status: 'read',
            },
            {
              threadId: thread.id,
              sender: 'bot',
              text: 'I can help you with your billing inquiry. Let me pull up your account details.',
              timestamp: lastMessageAt,
              status: 'read',
            },
          ],
        });
      }

      console.log(`Created conversation thread & messages for: ${customerName}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

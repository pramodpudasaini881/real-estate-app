import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean up existing data first
  await prisma.property.deleteMany();
  await prisma.agent.deleteMany();

  const agent1 = await prisma.agent.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@broker.com',
      isAdmin: false,
    }
  });

  const agent2 = await prisma.agent.create({
    data: {
      name: 'Bob Smith (Admin)',
      email: 'bob@broker.com',
      isAdmin: true,
    }
  });

  const properties = [
    {
      title: 'Modern Apartment in City Center',
      description: 'A beautiful 2-bedroom apartment with city views.',
      price: 450000,
      beds: 2,
      baths: 2,
      propertyType: 'Apartment',
      suburb: 'Downtown',
      agentId: agent1.id,
      statusNote: 'Needs minor repairs to balcony before showing.',
    },
    {
      title: 'Spacious Family Home',
      description: '4-bedroom house with a large backyard, perfect for a family.',
      price: 850000,
      beds: 4,
      baths: 3,
      propertyType: 'House',
      suburb: 'Northside',
      agentId: agent1.id,
      statusNote: 'Owner is motivated to sell quickly.',
    },
    {
      title: 'Cozy Studio near University',
      description: 'Great investment opportunity or student living.',
      price: 250000,
      beds: 1,
      baths: 1,
      propertyType: 'Studio',
      suburb: 'University District',
      agentId: agent2.id,
      statusNote: 'Currently rented until next year.',
    },
    {
      title: 'Luxury Villa with Pool',
      description: 'Stunning 5-bedroom villa featuring modern architecture and a private pool.',
      price: 2500000,
      beds: 5,
      baths: 5,
      propertyType: 'Villa',
      suburb: 'Beverly Hills',
      agentId: agent2.id,
      statusNote: 'VIP client, require proof of funds before showing.',
    },
    {
      title: 'Charming Townhouse',
      description: 'Historic townhouse restored to perfection.',
      price: 640000,
      beds: 3,
      baths: 2,
      propertyType: 'Townhouse',
      suburb: 'Old Town',
      agentId: agent1.id,
    }
  ];

  for (const p of properties) {
    await prisma.property.create({ data: p });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

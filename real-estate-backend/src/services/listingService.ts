import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export interface GetListingsFilter {
  price_min?: number;
  price_max?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

export const getListings = async (filters: GetListingsFilter) => {
  const {
    price_min,
    price_max,
    beds,
    baths,
    propertyType,
    keyword,
    page = 1,
    limit = 20,
  } = filters;

  const where: Prisma.PropertyWhereInput = {};

  if (price_min !== undefined || price_max !== undefined) {
    where.price = {};
    if (price_min !== undefined) where.price.gte = Number(price_min);
    if (price_max !== undefined) where.price.lte = Number(price_max);
  }

  if (beds !== undefined) {
    where.beds = { gte: Number(beds) }; // usually people want "at least X beds"
  }

  if (baths !== undefined) {
    where.baths = { gte: Number(baths) };
  }

  if (propertyType) {
    where.propertyType = propertyType;
  }

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
      { suburb: { contains: keyword, mode: 'insensitive' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        agent: {
          select: { id: true, name: true, email: true }
        }
      }
    }),
    prisma.property.count({ where })
  ]);

  return {
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    }
  };
};

export const getListingById = async (id: number) => {
  return prisma.property.findUnique({
    where: { id },
    include: {
      agent: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

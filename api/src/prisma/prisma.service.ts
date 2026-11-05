import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const dbUrl = new URL(process.env.DATABASE_URL as string);
    dbUrl.searchParams.set('uselibpqcompat', 'true');
    const adapter = new PrismaPg({ connectionString: dbUrl.toString() });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
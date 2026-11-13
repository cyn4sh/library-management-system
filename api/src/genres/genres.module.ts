import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { GenresController } from './genres.controller.js';
import { GenresService } from './genres.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
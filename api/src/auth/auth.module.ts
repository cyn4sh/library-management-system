import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not set in .env');
}

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({ secret, signOptions: { expiresIn: '1d' } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
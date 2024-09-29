import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.feedback.findMany();
  }

  async create(userId: string, description: string) {
    return await this.prisma.feedback.create({
      data: {
        description,
        userId,
        status: {},
      },
    });
  }
}

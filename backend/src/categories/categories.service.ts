import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return data;
  }

  async findBySlug(slug: string) {
    const data = await this.prisma.category.findFirst({
      where: {
        slug,
        isActive: true,
      },
    });

    if (!data) {
      throw new Error('Category not found');
    }

    return data;
  }
}
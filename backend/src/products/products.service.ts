import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: ProductFilters = {}) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      onSale,
      sortBy = 'newest',
      page = 1,
      limit = 12,
    } = filters;

    const where: any = {
      isActive: true,
      isDraft: false,
    };

    // Apply filters
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      const categoryData = await this.prisma.category.findUnique({
        where: { slug: category },
        select: { id: true },
      });
      
      if (categoryData) {
        where.categoryId = categoryData.id;
      }
    }

    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice };
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice };
    }

    if (inStock) {
      where.isStock = true;
      where.stock = { gt: 0 };
    }

    if (onSale) {
      where.isDiscount = true;
    }

    let orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [data, count] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async findBySlug(slug: string) {
    const data = await this.prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
        isDraft: false,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!data) {
      throw new Error('Product not found');
    }

    return data;
  }

  async findById(id: string) {
    const data = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!data) {
      throw new Error('Product not found');
    }

    return data;
  }

  async findDrafts(filters: ProductFilters = {}) {
    const {
      search,
      category,
      sortBy = 'newest',
      page = 1,
      limit = 12,
    } = filters;

    const where: any = {
      isDraft: true,
    };

    // Apply filters
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      const categoryData = await this.prisma.category.findUnique({
        where: { slug: category },
        select: { id: true },
      });
      
      if (categoryData) {
        where.categoryId = categoryData.id;
      }
    }

    let orderBy: any = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [data, count] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async findFeatured(limit = 8) {
    const data = await this.prisma.product.findMany({
      where: {
        isFeature: true,
        isActive: true,
        isDraft: false,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      take: limit,
    });

    return data;
  }

  async findRecent(limit = 8) {
    const data = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isDraft: false,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return data;
  }

  async create(createProductDto: any) {
    const data = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        slug: createProductDto.slug,
        description: createProductDto.description,
        price: createProductDto.price,
        discountPrice: createProductDto.discountPrice,
        isDiscount: createProductDto.isDiscount || false,
        isFeature: createProductDto.isFeature || false,
        isActive: createProductDto.isActive || true,
        isDraft: createProductDto.isDraft || false,
        categoryId: createProductDto.categoryId,
        imageUrl: createProductDto.imageUrl,
        stock: createProductDto.stock || 0,
        isStock: createProductDto.isStock || true,
        variation1: createProductDto.variation1,
        variation2: createProductDto.variation2,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    return data;
  }

  async update(id: string, updateProductDto: any) {
    const data = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    return data;
  }

  async remove(id: string) {
    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}
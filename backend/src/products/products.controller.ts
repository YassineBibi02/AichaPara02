import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService, ProductFilters } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: any) {
    const filters: ProductFilters = {
      search: query.search,
      category: query.category,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      inStock: query.inStock === 'true',
      onSale: query.onSale === 'true',
      sortBy: query.sortBy || 'newest',
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 12,
    };

    return this.productsService.findAll(filters);
  }

  @Get('featured')
  async findFeatured(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 8;
    return this.productsService.findFeatured(limitNum);
  }

  @Get('recent')
  async findRecent(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 8;
    return this.productsService.findRecent(limitNum);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
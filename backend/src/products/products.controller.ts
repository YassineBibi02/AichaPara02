import { Controller, Get, Post, Put, Delete, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ProductsService, ProductFilters } from './products.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  @Get('drafts')
  @UseGuards(AuthGuard)
  async findDrafts(@Query() query: any) {
    const filters: ProductFilters = {
      search: query.search,
      category: query.category,
      sortBy: query.sortBy || 'newest',
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 12,
    };

    return this.productsService.findDrafts(filters);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get('admin/:id')
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
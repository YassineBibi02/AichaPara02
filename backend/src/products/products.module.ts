import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SupabaseService } from '../config/supabase.config';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, SupabaseService],
  exports: [ProductsService],
})
export class ProductsModule {}
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.config';

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
  constructor(private supabaseService: SupabaseService) {}

  async findAll(filters: ProductFilters = {}) {
    const supabase = this.supabaseService.getClient();
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

    let query = supabase
      .from('products')
      .select(
        `
        *,
        category:categories(name, slug)
      `,
        { count: 'exact' },
      )
      .eq('is_active', true)
      .eq('is_draft', false);

    // Apply filters
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`,
      );
    }

    if (category) {
      // First get category ID by slug
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    if (inStock) {
      query = query.eq('is_stock', true).gt('stock', 0);
    }

    if (onSale) {
      query = query.eq('is_discount', true);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return {
      data,
      count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async findBySlug(slug: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(name, slug)
      `,
      )
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_draft', false)
      .single();

    if (error) {
      throw new Error(`Product not found: ${error.message}`);
    }

    return data;
  }

  async findFeatured(limit = 8) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(name, slug)
      `,
      )
      .eq('is_feature', true)
      .eq('is_active', true)
      .eq('is_draft', false)
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured products: ${error.message}`);
    }

    return data;
  }

  async findRecent(limit = 8) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(name, slug)
      `,
      )
      .eq('is_active', true)
      .eq('is_draft', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent products: ${error.message}`);
    }

    return data;
  }
}
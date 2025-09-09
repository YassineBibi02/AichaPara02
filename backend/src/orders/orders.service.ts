import { Injectable, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.config';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createOrderDto: CreateOrderDto) {
    const supabase = this.supabaseService.getClient();

    // Validate cart totals
    const calculatedSubtotal = createOrderDto.cart.reduce((sum, item) => {
      const price = item.discountPrice || item.price;
      return sum + (price * item.qty);
    }, 0);

    const calculatedShipping = calculatedSubtotal < 100 ? 8 : 0;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    // Verify totals match
    if (
      Math.abs(calculatedSubtotal - createOrderDto.subtotal) > 0.01 ||
      Math.abs(calculatedShipping - createOrderDto.shippingFee) > 0.01 ||
      Math.abs(calculatedTotal - createOrderDto.total) > 0.01
    ) {
      throw new Error('Order totals do not match calculated values');
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: createOrderDto.isGuest ? null : createOrderDto.userId,
        is_guest: createOrderDto.isGuest,
        first_name: createOrderDto.firstName,
        last_name: createOrderDto.lastName,
        email: createOrderDto.email,
        phone: createOrderDto.phone,
        address_line1: createOrderDto.addressLine1,
        address_line2: createOrderDto.addressLine2,
        company: createOrderDto.company,
        postal_code: createOrderDto.postalCode,
        city: createOrderDto.city,
        cart: createOrderDto.cart,
        payment_method: createOrderDto.paymentMethod,
        status: createOrderDto.status || 'PENDING',
        subtotal: createOrderDto.subtotal,
        shipping_fee: createOrderDto.shippingFee,
        total: createOrderDto.total,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }

    return data;
  }

  async findByUser(userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user orders: ${error.message}`);
    }

    return data;
  }

  async findAll(userRole?: string) {
    if (!userRole || !['admin', 'superadmin'].includes(userRole)) {
      throw new ForbiddenException('Access denied');
    }

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return data;
  }

  async findById(id: string, userId?: string, userRole?: string) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('orders')
      .select('*')
      .eq('id', id);

    // If not admin, only allow access to own orders
    if (!userRole || !['admin', 'superadmin'].includes(userRole)) {
      if (!userId) {
        throw new ForbiddenException('Access denied');
      }
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) {
      throw new Error(`Order not found: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updateOrderDto: any, userId?: string, userRole?: string) {
    if (!userRole || !['admin', 'superadmin'].includes(userRole)) {
      throw new ForbiddenException('Access denied');
    }

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('orders')
      .update(updateOrderDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }

    return data;
  }

  async remove(id: string, userRole?: string) {
    if (!userRole || !['admin', 'superadmin'].includes(userRole)) {
      throw new ForbiddenException('Access denied');
    }

    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }

    return { message: 'Order deleted successfully' };
  }
}
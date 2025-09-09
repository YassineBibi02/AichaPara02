import { IsString, IsEmail, IsArray, IsNumber, IsBoolean, IsOptional, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsNumber()
  qty: number;

  @IsOptional()
  @IsString()
  variation1?: string;

  @IsOptional()
  @IsString()
  variation2?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsBoolean()
  isGuest: boolean;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  postalCode: string;

  @IsString()
  city: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cart: CartItemDto[];

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsIn(['PENDING', 'PAID', 'FULFILLED', 'CANCELED', 'REFUNDED'])
  status?: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  shippingFee: number;

  @IsNumber()
  total: number;
}
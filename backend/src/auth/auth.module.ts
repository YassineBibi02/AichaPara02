import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { SupabaseService } from '../config/supabase.config';

@Module({
  providers: [AuthGuard, SupabaseService],
  exports: [AuthGuard],
})
export class AuthModule {}
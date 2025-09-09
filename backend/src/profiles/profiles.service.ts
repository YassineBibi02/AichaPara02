import { Injectable, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.config';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private supabaseService: SupabaseService) {}

  async findById(id: string, requestingUserId?: string, requestingUserRole?: string) {
    // Users can only access their own profile unless they're admin
    if (
      id !== requestingUserId &&
      (!requestingUserRole || !['admin', 'superadmin'].includes(requestingUserRole))
    ) {
      throw new ForbiddenException('Access denied');
    }

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Profile not found: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto, requestingUserId?: string) {
    // Users can only update their own profile
    if (id !== requestingUserId) {
      throw new ForbiddenException('Access denied');
    }

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: updateProfileDto.firstName,
        last_name: updateProfileDto.lastName,
        phone: updateProfileDto.phone,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  async findAll(requestingUserRole?: string) {
    if (!requestingUserRole || !['admin', 'superadmin'].includes(requestingUserRole)) {
      throw new ForbiddenException('Access denied');
    }

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    return data;
  }

  async updateByAdmin(id: string, updateProfileDto: UpdateProfileDto, requestingUserRole?: string) {
    if (!requestingUserRole || !['admin', 'superadmin'].includes(requestingUserRole)) {
      throw new ForbiddenException('Access denied');
    }

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: updateProfileDto.firstName,
        last_name: updateProfileDto.lastName,
        phone: updateProfileDto.phone,
        role: updateProfileDto.role,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  async remove(id: string, requestingUserRole?: string) {
    if (!requestingUserRole || !['admin', 'superadmin'].includes(requestingUserRole)) {
      throw new ForbiddenException('Access denied');
    }

    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }

    return { message: 'Profile deleted successfully' };
  }
}
import { Controller, Get, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async getMyProfile(@Request() req: any) {
    return this.profilesService.findById(req.user.id, req.user.id, req.user.role);
  }

  @Put('me')
  async updateMyProfile(@Body() updateProfileDto: UpdateProfileDto, @Request() req: any) {
    return this.profilesService.update(req.user.id, updateProfileDto, req.user.id);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.profilesService.findAll(req.user.role);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Request() req: any) {
    return this.profilesService.findById(id, req.user.id, req.user.role);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto, @Request() req: any) {
    return this.profilesService.updateByAdmin(id, updateProfileDto, req.user.role);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.profilesService.remove(id, req.user.role);
  }
}
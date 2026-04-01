import { Controller, Post, UseGuards } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Post('migrate-images')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async migrateImages() {
    return this.migrationService.migrateImagesToCloudinary();
  }
}

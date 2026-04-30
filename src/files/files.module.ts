import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ConfigService],
})
export class FilesModule {}

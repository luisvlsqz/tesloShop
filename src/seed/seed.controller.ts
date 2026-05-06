import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('seed')
@Auth( ValidRoles.superUser! )
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed() {

    return this.seedService.runSeed();

  }

}

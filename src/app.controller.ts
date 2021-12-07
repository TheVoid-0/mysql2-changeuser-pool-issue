import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './common/database/database.service';

@Controller('ping')
export class AppController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('test')
  async teste() {
    const connection1 = await this.databaseService.connect({
      database: 1,
      ip_address: 'host',
    });
    // won't be able to connect because it will fail on pool.getConnection()
    const connection2 = await this.databaseService.connect({
      database: 2,
      ip_address: 'sameHost',
    });
  }
}

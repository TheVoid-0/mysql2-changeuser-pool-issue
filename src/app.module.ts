import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConfigServiceConfiguration } from './common/config/app.module.config';
// import { RouterModule } from '@nestjs/core';
import { DatabaseModule } from './common/database/database.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/error/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot(getConfigServiceConfiguration()),
    DatabaseModule,
    // RouterModule.register([{ path: 'reseller', module: ResellerModule }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}

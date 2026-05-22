import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BansosModule }
from './modules/bansos/bansos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbHost = config.get<string>('DB_HOST');

        return {
          type: 'postgres',
          host: dbHost === 'postgres' ? 'localhost' : dbHost,
          port: config.get<number>('DB_PORT') || 5432,
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),

          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),

    BansosModule,
  ],
})
export class AppModule {}
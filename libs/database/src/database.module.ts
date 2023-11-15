import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigDatabase } from './config-database';

@Module({})
export class DatabaseCoreModule {
  static forRoot(config: ConfigDatabase): DynamicModule {
    return {
      module: DatabaseCoreModule,
      exports: [TypeOrmModule],
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          name: config.nameConnections,
          useFactory: (
            configureService: ConfigService,
          ): TypeOrmModuleOptions => {
            return {
              type: 'mysql',
              host: configureService.get('MYSQL_CORE_HOST') || 'localhost',
              port: configureService.get('MYSQL_CORE_PORT') || 3306,
              username: configureService.get('MYSQL_CORE_USER') || 'root',
              password: configureService.get('MYSQL_CORE_PASSWORD') || 'root',
              database: configureService.get('MYSQL_CORE_DATABASE') || 'test',
              entities: config.entities,
              synchronize: config.sync,
            };
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature(config.entities, config.nameConnections),
      ],
    };
  }
}

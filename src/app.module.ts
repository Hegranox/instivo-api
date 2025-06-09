import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppRepository } from './app.repository';
import { SalarioFuncionario } from './entities/salario_funcionario.entity';
import Joi from 'joi';
import { JoiPipeModule } from 'nestjs-joi';

@Module({
  imports: [
    JoiPipeModule,
    TypeOrmModule.forFeature([SalarioFuncionario]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .required(),
        PORT: Joi.number(),
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get('MONGODB_URI'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppRepository],
})
export class AppModule {}

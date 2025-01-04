import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { User } from './modules/users/entity/user.entity';
import { ExperimentsModule } from './modules/experiments/experiments.module';
import { TestCasesModule } from './modules/test-cases/test-cases.module';
import { TestCaseResultsModule } from './modules/test-case-results/test-case-results.module';
import { ExperimentRunsModule } from './modules/experiment-runs/experiment-runs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule global
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    MailModule,
    ExperimentsModule,
    TestCasesModule,
    TestCaseResultsModule,
    ExperimentRunsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

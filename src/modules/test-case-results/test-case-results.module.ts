import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCaseResult } from './entities/test-case-result.entity';
import { TestCaseResultsService } from './test-case-results.service';
import { TestCaseResultsController } from './test-case-results.controller';
import { TestCasesModule } from '../test-cases/test-cases.module';
import { TestCasesService } from '../test-cases/test-cases.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestCaseResult]), TestCasesModule],
  providers: [TestCaseResultsService],
  controllers: [TestCaseResultsController],
  exports: [TestCaseResultsService],
})
export class TestCaseResultsModule {}

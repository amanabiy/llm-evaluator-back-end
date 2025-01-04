import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCaseResult } from './entities/test-case-result.entity';
import { TestCaseResultsService } from './test-case-results.service';
import { TestCaseResultsController } from './test-case-results.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestCaseResult])],
  providers: [TestCaseResultsService],
  controllers: [TestCaseResultsController],
  exports: [TestCaseResultsService],
})
export class TestCaseResultsModule {}

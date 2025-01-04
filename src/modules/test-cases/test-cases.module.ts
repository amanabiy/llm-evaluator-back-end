import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from './entities/test-case.entity';
import { TestCasesService } from './test-cases.service';
import { TestCasesController } from './test-cases.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestCase])],
  providers: [TestCasesService],
  controllers: [TestCasesController],
  exports: [TestCasesService],
})
export class TestCasesModule {}

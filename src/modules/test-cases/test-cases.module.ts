import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCasesService } from './test-cases.service';
import { TestCasesController } from './test-cases.controller';
import { TestCase } from './entities/test-case.entity';
import { ExperimentsModule } from '../experiments/experiments.module';  // Import ExperimentsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([TestCase]),
    ExperimentsModule,  // Ensure ExperimentsModule is imported
  ],
  controllers: [TestCasesController],
  providers: [TestCasesService],
})
export class TestCasesModule {}

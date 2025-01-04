import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentRun } from './entities/experiment-run.entity';
import { ExperimentRunsService } from './experiment-runs.service';
import { ExperimentRunsController } from './experiment-runs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExperimentRun])],
  providers: [ExperimentRunsService],
  controllers: [ExperimentRunsController],
  exports: [ExperimentRunsService],
})
export class ExperimentRunsModule {}

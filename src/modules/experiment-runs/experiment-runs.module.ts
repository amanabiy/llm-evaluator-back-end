import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentRun } from './entities/experiment-run.entity';
import { ExperimentRunsService } from './experiment-runs.service';
import { ExperimentRunsController } from './experiment-runs.controller';
import { ExperimentsModule } from '../experiments/experiments.module';
import { BullModule } from '@nestjs/bullmq';
import { ExperimentRunQueueWorker } from './experiment-queue.processor';
import { TestCaseResultsModule } from '../test-case-results/test-case-results.module';
import { GroqIntegrationService } from '../llm/groq/qroq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExperimentRun]),
    BullModule.registerQueue({
      name: 'run-experiment', // Name of the queue for experiment runs
    }),
    ExperimentsModule,
    TestCaseResultsModule,
  ],
  providers: [ExperimentRunsService, ExperimentRunQueueWorker, GroqIntegrationService],
  controllers: [ExperimentRunsController],
  exports: [ExperimentRunsService, ExperimentRunQueueWorker],
})
export class ExperimentRunsModule {}

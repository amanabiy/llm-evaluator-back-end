import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';
import { TestCasesModule } from '../test-cases/test-cases.module';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment]),
    forwardRef(() => TestCasesModule),
  ],
  providers: [ExperimentsService],
  controllers: [ExperimentsController],
  exports: [ExperimentsService],
})
export class ExperimentsModule { }

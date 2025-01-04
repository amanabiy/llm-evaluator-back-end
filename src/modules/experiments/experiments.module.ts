import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment])],
  providers: [ExperimentsService],
  controllers: [ExperimentsController],
  exports: [ExperimentsService],
})
export class ExperimentsModule {}

import { PartialType } from '@nestjs/swagger';
import { CreateExperimentRunDto } from './create-experiment-run.dto';

export class UpdateExperimentRunDto extends PartialType(CreateExperimentRunDto) {}

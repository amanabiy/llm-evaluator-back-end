import { PartialType } from '@nestjs/swagger';
import { CreateTestCaseResultDto } from './create-test-case-result.dto';

export class UpdateTestCaseResultDto extends PartialType(CreateTestCaseResultDto) {}

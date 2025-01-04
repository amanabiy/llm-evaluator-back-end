import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTestCaseDto } from './create-test-case.dto';

// Exclude 'experimentId' attribute from the UpdateTestCaseDto
export class UpdateTestCaseDto extends PartialType(
  OmitType(CreateTestCaseDto, ['experimentId'] as const),
) {}

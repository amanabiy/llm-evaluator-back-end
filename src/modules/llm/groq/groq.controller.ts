import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroqIntegrationService } from './qroq.service';

@ApiTags('LLM')  // Grouping this controller under the 'LLM' tag
@Controller('llm')
export class GroqLlmController {
  constructor(private readonly groqIntegrationService: GroqIntegrationService) {}

  @ApiOperation({
    summary: 'Get available LLM models',
    description: 'Returns a list of available Large Language Models (LLM) that can be used.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available LLM models returned successfully.',
    type: [String],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  @Get('models')
  getAvailableModels(): string[] {
    return this.groqIntegrationService.getAvailableModels();
  }
}

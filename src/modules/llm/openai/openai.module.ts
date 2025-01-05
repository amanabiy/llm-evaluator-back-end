import { Module } from '@nestjs/common';
import { OpenAIIntegrationService } from './openai.service';

@Module({
  providers: [OpenAIIntegrationService],
  exports: [OpenAIIntegrationService], // Export the service for internal use in other modules
})

export class OpenAIModule {}

import { Module } from '@nestjs/common';
import { GroqIntegrationService } from './qroq.service';
import { GroqLlmController } from './groq.controller';

@Module({
  controllers: [GroqLlmController],
  providers: [GroqIntegrationService],
  exports: [GroqIntegrationService], // Export the service for internal use in other modules
})

export class GroqAIModule {}

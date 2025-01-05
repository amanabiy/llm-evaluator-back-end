import { Module } from '@nestjs/common';
import { GroqIntegrationService } from './qroq.service';

@Module({
  providers: [GroqIntegrationService],
  exports: [GroqIntegrationService], // Export the service for internal use in other modules
})

export class GroqAIModule {}

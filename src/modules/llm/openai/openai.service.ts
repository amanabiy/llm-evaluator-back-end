// src/openai/openai.service.ts

import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { LLMIntegrationInterface } from '../interface/llm-integration.interface';


@Injectable()
export class OpenAIIntegrationService implements LLMIntegrationInterface {
  private openai: OpenAI;

  constructor() {
    // Initialize the OpenAI client with the API key
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // API key should be stored in .env file
    });
  }

  // Generate a response from OpenAI based on the prompt
  async generateResponse(
    prompt: string,
    maxTokens: number = 100,
    temperature: number = 0.7,
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // You can change this model as needed
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      });

      return response.choices[0]?.message.content.trim();
    } catch (error) {
      this.handleError(error);
    }
  }

  // Handle chat conversations with OpenAI
//   async chat(
//     messages: ChatMessageDto[],
//     model: string = 'gpt-3.5-turbo',
//   ): Promise<any> {
//     try {
//       const formattedMessages = messages.map(msg => ({
//         role: msg.role,
//         content: msg.content,
//       }));

//       const response = await this.openai.chat.completions.create({
//         model,
//         messages: formattedMessages,
//       });

//       return response;
//     } catch (error) {
//       this.handleError(error);
//     }
//   }

  // Handle errors from OpenAI API
  handleError(error: any): void {
    console.error('OpenAI API Error: ', error.response?.data || error.message);
    throw new Error('Failed to connect to OpenAI API');
  }
}

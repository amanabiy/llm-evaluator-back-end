// src/groq/groq-integration.service.ts

import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { LLMIntegrationInterface, Message } from '../interface/llm-integration.interface';

// Define the available models
export const AvailableModels = [
  'distil-whisper-large-v3-en',
  'gemma2-9b-it',
  'gemma-7b-it (DEPRECATED)',
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile (DEPRECATED)',
  'llama-3.1-8b-instant',
  'llama-guard-3-8b',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'mixtral-8x7b-32768',
  'whisper-large-v3',
  'whisper-large-v3-turbo',
];

@Injectable()
export class GroqIntegrationService implements LLMIntegrationInterface {
  private groq: Groq;

  constructor() {
    // Initialize Groq client with API key
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY, // API key should be stored in .env
    });
  }

  // Generate a response based on the prompt from Groq chat completions
  async generateResponse(
    prompt: string,
    maxTokens: number = 100, // Default value for maxTokens
    temperature: number = 0.7, // Default value for temperature
    model: string = "llama-3.3-70b-versatile",
  ): Promise<string> {
    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: model, // Default model (can be changed based on use case)
        // maxTokens, // Pass maxTokens
        temperature, // Pass temperature
      });

      return response.choices[0]?.message?.content || 'No response';
    } catch (error) {
      this.handleError(error);
    }
  }

  // // Handle chat conversations with Groq
  // async chat(
  //   messages: Message[], // Using the Message interface here
  //   model: string = 'llama-3.3-70b-versatile', // Default model
  // ): Promise<any> {
  //   try {
  //     const formattedMessages = messages.map(msg => ({
  //       role: msg.role,
  //       content: msg.content,
  //       name: msg.name || undefined,  // Ensure name is passed as undefined if not provided
  //     }));

  //     const response = await this.groq.chat.completions.create({
  //       messages: formattedMessages,
  //       model,
  //     });

  //     return response;
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  // Get the list of available models
  getAvailableModels(): string[] {
    return AvailableModels;
  }

  // Handle errors from the Groq API
  handleError(error: any): void {
    console.error('Groq API Error: ', error.response?.data || error.message);
    throw new Error('Failed to connect to Groq API');
  }
}

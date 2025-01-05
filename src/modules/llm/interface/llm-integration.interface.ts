export interface Message {
    role: string;
    content: string;
    name?: string;  // Add the optional 'name' property
  }
  

export interface LLMIntegrationInterface {
    generateResponse(
        prompt: string,
        maxTokens?: number,
        temperature?: number,
        model?: string,
    ): Promise<string>;

    // chat(
    //     messages: Message[], // Use the Message interface here
    //     model?: string,
    // ): Promise<any>;

    // handleError(error: any): void;
}

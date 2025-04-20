export interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: 'chatbot' | 'classifier' | 'analyzer' | 'assistant';
  status: 'active' | 'paused' | 'error' | 'configuring';
  model: string;
  version: string;
  lastTrained: string;
  capabilities: string[];
  integrations: string[];
  llmConfig: {
    provider: string;
    model: string;
    temperature: number;
    maxInputTokens: number;
    maxOutputTokens: number;
  };
}

export interface LLMConfig {
  provider: string;
  model: string;
  apiKey: string;
  baseUrl?: string;
  temperature: number;
  maxInputTokens: number;
  maxOutputTokens: number;
}
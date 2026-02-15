import axios from 'axios';
import { ChatMessage } from '../types';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export interface AnthropicResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export const sendAnthropicMessage = async (
  messages: ChatMessage[],
  model: string = 'claude-3-5-sonnet-20241022',
  temperature: number = 0.7
): Promise<string> => {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  // Separate system messages from user/assistant messages
  const systemMessages = messages
    .filter(msg => msg.role === 'system')
    .map(msg => msg.content)
    .join('\n');

  const conversationMessages = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

  try {
    const response = await axios.post<AnthropicResponse>(
      ANTHROPIC_API_URL,
      {
        model,
        messages: conversationMessages,
        system: systemMessages || undefined,
        max_tokens: 4096,
        temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
      }
    );

    return response.data.content[0]?.text || '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Anthropic API error: ${error.response?.data?.error?.message || error.message}`
      );
    }
    throw error;
  }
};

export const generateCodeWithAnthropic = async (
  prompt: string,
  context?: string
): Promise<string> => {
  const systemMessage: ChatMessage = {
    id: 'system',
    role: 'system',
    content: `You are an expert web developer. Generate clean, modern HTML, CSS, and JavaScript code based on user requests. 
    Always provide complete, working code. Format your response with proper code blocks.
    ${context ? `Current code context:\n${context}` : ''}`,
    timestamp: new Date(),
  };

  const userMessage: ChatMessage = {
    id: 'user',
    role: 'user',
    content: prompt,
    timestamp: new Date(),
  };

  return sendAnthropicMessage([systemMessage, userMessage], 'claude-3-5-sonnet-20241022', 0.7);
};

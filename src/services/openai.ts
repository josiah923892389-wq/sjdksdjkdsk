import axios from 'axios';
import type { ChatMessage } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface OpenAIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const sendOpenAIMessage = async (
  messages: ChatMessage[],
  model: string = 'gpt-4',
  temperature: number = 0.7
): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await axios.post<OpenAIResponse>(
      OPENAI_API_URL,
      {
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0]?.message?.content || '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `OpenAI API error: ${error.response?.data?.error?.message || error.message}`
      );
    }
    throw error;
  }
};

export const generateCodeWithOpenAI = async (
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

  return sendOpenAIMessage([systemMessage, userMessage], 'gpt-4', 0.7);
};

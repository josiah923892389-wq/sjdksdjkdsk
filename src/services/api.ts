import { AIProvider, ChatMessage } from '../types';
import { sendOpenAIMessage, generateCodeWithOpenAI } from './openai';
import { sendAnthropicMessage, generateCodeWithAnthropic } from './anthropic';

export const sendAIMessage = async (
  provider: AIProvider,
  messages: ChatMessage[],
  model?: string,
  temperature: number = 0.7
): Promise<string> => {
  if (provider === 'openai') {
    return sendOpenAIMessage(messages, model || 'gpt-4', temperature);
  } else {
    return sendAnthropicMessage(messages, model || 'claude-3-5-sonnet-20241022', temperature);
  }
};

export const generateCode = async (
  provider: AIProvider,
  prompt: string,
  context?: string
): Promise<string> => {
  if (provider === 'openai') {
    return generateCodeWithOpenAI(prompt, context);
  } else {
    return generateCodeWithAnthropic(prompt, context);
  }
};

export const parseCodeFromResponse = (response: string): { html?: string; css?: string; js?: string } => {
  const result: { html?: string; css?: string; js?: string } = {};
  
  // Extract HTML code blocks
  const htmlMatch = response.match(/```html\n([\s\S]*?)```/);
  if (htmlMatch) {
    result.html = htmlMatch[1].trim();
  }
  
  // Extract CSS code blocks
  const cssMatch = response.match(/```css\n([\s\S]*?)```/);
  if (cssMatch) {
    result.css = cssMatch[1].trim();
  }
  
  // Extract JavaScript code blocks
  const jsMatch = response.match(/```(?:javascript|js)\n([\s\S]*?)```/);
  if (jsMatch) {
    result.js = jsMatch[1].trim();
  }
  
  return result;
};

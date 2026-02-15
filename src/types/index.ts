// User types
export interface User {
  id: string;
  email: string;
  created_at?: string;
}

// Project types
export interface Project {
  id: string;
  user_id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  name: string;
  content: string;
  language: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: Date;
}

// AI Provider types
export type AIProvider = 'openai' | 'anthropic';

export interface AISettings {
  provider: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Editor types
export interface EditorFile {
  id: string;
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript' | 'typescript';
}

// Device preview types
export type DeviceSize = 'desktop' | 'tablet' | 'mobile';

export interface DevicePreview {
  size: DeviceSize;
  width: string;
  height: string;
}

import type { AnswerV2Source, AnswerV2UsageEntry } from '@qwant/answer';

export type { AnswerV2Source, AnswerV2UsageEntry };

export type Role = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  sources?: AnswerV2Source[];
  relatedQueries?: string[];
  usage?: { input_tokens: number; output_tokens: number };
  isStreaming?: boolean;
  error?: string;
}

export interface Settings {
  apiKey: string;
  baseURL: string;
  filter: string;
  mode: 'short' | 'long';
  markdown: boolean;
  relatedQueries: boolean;
  queryRewrite: boolean;
  sourcesMode: 'search' | 'context';
  sources: { url: string }[];
}

export type Theme = 'light' | 'dark' | 'auto';

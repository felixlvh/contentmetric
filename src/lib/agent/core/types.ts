// src/lib/agent/core/types.ts
export type AgentRequestParams = {
  prompt: string;
  documentId?: string;
  context?: any;
  userId: string;
};

export type AgentResponse = {
  content: string;
  actions?: string[];
  suggestions?: string[];
};

export interface AgentCapability {
  name: string;
  description: string;
  execute: (prompt: string, context?: any) => Promise<{
    content: string;
    actions?: string[];
  }>;
} 
import { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react';

export type TemplateType = 
  | 'react'
  | 'react-ts'
  | 'vanilla'
  | 'vanilla-ts'
  | 'angular'
  | 'vue'
  | 'vue-ts'
  | 'nextjs'
  | 'node'
  | 'static';

export interface TemplateConfig {
  files: Record<string, string>;
  dependencies?: Record<string, string>;
  entry?: string;
  main?: string;
  template: SandpackPredefinedTemplate;
} 
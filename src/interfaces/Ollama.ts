import { ExtractLabels } from "../types";
import { Task } from "./Task";
import { PromptTemplate } from '@langchain/core/prompts';
import { Ollama } from '@langchain/community/llms/ollama';

export class OllamaModel<sT extends string, aT extends string, uT extends string> {
  private model: Ollama;

  private modelName: string;
  private tempature: number;
  private baseUrl: string;
  private systemTemplate: sT;
  private assistantTemplate: aT;
  private userTemplate: uT;

  constructor(options: {
    modelName: string,
    tempature?: number,
    baseUrl?: string,
    systemTemplate: sT,
    assistantTemplate: aT,
    userTemplate: uT,
  }) {
    this.modelName = options.modelName;
    this.tempature = options.tempature || 0.6;
    this.baseUrl = options.baseUrl || 'http://localhost:11434';
    this.systemTemplate = options.systemTemplate;
    this.assistantTemplate = options.assistantTemplate;
    this.userTemplate = options.userTemplate;

    this.model = new Ollama({
      baseUrl: this.baseUrl,
      model: this.modelName,
      temperature: this.tempature
    });
  }

  getPromptTemplate<T extends string>(task: Task<T>) {
    const promptTemplate = PromptTemplate.fromTemplate([
      this.getSystemTemplate({ prompt: task.getSystemPrompt() } as Record<ExtractLabels<sT>, any>),

      ...task.getHistory().map((context) => {
        return context.user === 'assistant' ? this.getAssistantTemplate(context, task.getContext()) : this.getUserTemplate(context, task.getContext());
      }),
      this.getUserTemplate({}, {}),
    ].join('\n'));

    return promptTemplate;
  }

  async invoke<T extends string>(task: Task<T>, prompt: string, context?: Record<ExtractLabels<T>, any>) {
    let tmpContext = task.getContext();
    if (context) {
      task.setContext(context);
    }

    let promptTemplate = this.getPromptTemplate(task);
    let chain = promptTemplate.pipe(this.getModel());

    if (context) {
      task.setContext(tmpContext);
    }

    console.log('promptTemplate', promptTemplate);

    return await chain.invoke({ prompt });
  }

  private getSystemTemplate(context: Record<ExtractLabels<sT>, any>) {
    return this.systemTemplate.replace(/{([^}]+)}/g, (match, label: ExtractLabels<sT>) => {
      return context[label] || match;
    });
  }

  private getModel() {
    return this.model;
  }

  private getAssistantTemplate(context: Record<string, any>, taskContext: Record<string, any>) {
    return this.assistantTemplate.replace(/{([^}]+)}/g, (match, label: string) => {
      return context[label] || match;
    }).replace(/{([^}]+)}/g, (match, label: string) => {
      return taskContext[label] || match;
    });
  }

  private getUserTemplate(context: Record<string, any>, taskContext: Record<string, any>) {
    return this.userTemplate.replace(/{([^}]+)}/g, (match, label: string) => {
      return context[label] || match;
    }).replace(/{([^}]+)}/g, (match, label: string) => {
      return taskContext[label] || match;
    });
  }
}
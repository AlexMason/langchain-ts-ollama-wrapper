import { ExtractLabels } from "../types";
import { Task } from "./Task";
import { PromptTemplate } from '@langchain/core/prompts';
import { Ollama } from '@langchain/community/llms/ollama';

export class OllamaModel<aT extends string, uT extends string> {
  private model: Ollama;

  private modelName: string;
  private tempature: number;
  private baseUrl: string;
  private assistantTemplate: aT;
  private userTemplate: uT;

  constructor(options: {
    modelName: string,
    tempature?: number,
    baseUrl?: string,
    assistantTemplate: aT,
    userTemplate: uT,
  }) {
    this.modelName = options.modelName;
    this.tempature = options.tempature || 0.6;
    this.baseUrl = options.baseUrl || 'http://localhost:11434';
    this.assistantTemplate = options.assistantTemplate;
    this.userTemplate = options.userTemplate;

    this.model = new Ollama({
      baseUrl: this.baseUrl,
      model: this.modelName,
      temperature: this.tempature
    });
  }

  async invoke<T extends string>(task: Task<T>, prompt: string, context?: Record<ExtractLabels<T>, any>) {
    let promptTemplate = this.getPromptTemplate(task, context || task.getContext());

    return await this.getPromptModelChain(promptTemplate, this.model).invoke({ prompt });
  }

  private getPromptModelChain(promptTemplate: PromptTemplate, model: Ollama) {
    return promptTemplate.pipe(model);
  }

  private getPromptTemplate<T extends string>(task: Task<T>, taskContext: Record<ExtractLabels<T>, any>) {
    return PromptTemplate.fromTemplate([
      this.applyContextToTemplate(task.getSystemPrompt(), taskContext),
      ...this.getPromptFormattedChatHistory(task, taskContext),
      this.userTemplate,
    ].join('\n'));
  }

  private getPromptFormattedChatHistory<T extends string>(task: Task<T>, taskContext: Record<ExtractLabels<T>, any>) {
    return task.getHistory().map((chatHistoryItem) => {
      let template: string = chatHistoryItem.user === 'assistant' ? this.assistantTemplate : this.userTemplate;

      template = this.applyContextToTemplate(template, chatHistoryItem);
      template = this.applyContextToTemplate(template, taskContext);

      return template;
    });
  }

  private applyContextToTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/{([^}]+)}/g, (match, label: string) => {
      return context[label] || match;
    });
  }
}
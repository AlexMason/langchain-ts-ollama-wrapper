import { ExtractLabels } from "../types";
import { Task } from "./Task";
import { PromptTemplate } from '@langchain/core/prompts';
import { Ollama, OllamaInput } from '@langchain/community/llms/ollama';

export class OllamaModel {
  private model: Ollama;

  private systemTemplate: string;
  private assistantTemplate: string;
  private userTemplate: string;

  constructor(options: {
    modelName: string,
    ollamaInput: OllamaInput,
    systemTemplate: string,
    assistantTemplate: string,
    userTemplate: string,
  }) {
    this.systemTemplate = options.systemTemplate;
    this.assistantTemplate = options.assistantTemplate;
    this.userTemplate = options.userTemplate;

    this.model = new Ollama({
      baseUrl: 'http://localhost:11434',
      model: options.modelName,
      ...(options.ollamaInput || {}),
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
      this.applyContextToTemplate(this.systemTemplate, { prompt: task.getSystemPrompt() }),
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
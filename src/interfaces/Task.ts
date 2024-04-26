import { ExtractLabels } from "../types";

export class Task<T extends string> {
  private systemPrompt: T;
  private context: Record<ExtractLabels<T>, any> = {} as Record<ExtractLabels<T>, any>;

  private history: {
    user: 'user' | 'assistant',
    prompt: string,
  }[] = [];

  constructor(options: { systemPrompt: T, context?: Record<ExtractLabels<T>, any> }) {
    this.systemPrompt = options.systemPrompt;
    this.context = options.context || {} as Record<ExtractLabels<T>, any>;
  }

  public setContext(context: Record<ExtractLabels<T>, any>) {
    this.context = context;
  }

  public getContext() {
    return this.context;
  }

  public getSystemPrompt() {
    return this.systemPrompt.replace(/{([^}]+)}/g, (match, label: ExtractLabels<T>) => {
      return this.context[label] || match;
    });
  }

  public addHistory(user: 'user' | 'assistant', prompt: string) {
    this.history.push({ user, prompt });
  }

  public getHistory() {
    return this.history;
  }
}
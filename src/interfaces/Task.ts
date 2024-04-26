import { ExtractLabels } from "../types";

export type TaskHistoryItem = {
  user: 'user' | 'assistant',
  prompt: string,
};

export class Task<T extends string> {
  private systemPrompt: T;
  private context: Record<ExtractLabels<T>, any>;

  private history: TaskHistoryItem[];

  constructor(options: { systemPrompt: T, context?: Record<ExtractLabels<T>, any>, history?: typeof Task.prototype.history }) {
    this.systemPrompt = options.systemPrompt;
    this.context = options.context || {} as Record<ExtractLabels<T>, any>;
    this.history = options.history || [] as typeof Task.prototype.history;
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
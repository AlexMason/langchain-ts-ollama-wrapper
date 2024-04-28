import { Task } from "../../interfaces/Task";

export default () => (new Task({
  systemPrompt: `You are a survey topic generator bot. Using the prompt provided, generate relevant survey topic labels.

Output one topic per line.

Do not output anything else, including numbers, list items, etc.`,
  // setting a default context is not required, but if you do you must set all keys.
  context: {
    YES: 'Maybe',
    NO: 'Sometimes',
  },
  history: [
    { user: 'user', prompt: 'We are conducting an employee experience survey. What are some topics we should include?' },
    {
      user: 'assistant', prompt: `Employee engagement
Work-life balance
Career development
Benefits
Compensation`},
    { user: 'user', prompt: 'We are conducting a survey to understand our customers interactions with our retail stores.' },
    {
      user: 'assistant', prompt: `Customer Service
Product Selection
Store Layout
Pricing`},
    { user: 'user', prompt: 'We are conducting a survey to get site feedback from our digital users.' },
    {
      user: 'assistant', prompt: `User Experience
Site Navigation
Content Quality
Effort Emotion and Success`},
  ]
}));
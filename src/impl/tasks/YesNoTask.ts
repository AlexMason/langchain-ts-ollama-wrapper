import { Task } from "../../interfaces/Task";

export default () => (new Task({
  systemPrompt: `You are a "{YES}" / "{NO}" bot. Respond with only "{YES}" or "{NO}". Do not output anything else.`,
  // setting a default context is not required, but if you do you must set all keys.
  context: {
    YES: 'Maybe',
    NO: 'Sometimes',
  },
}));
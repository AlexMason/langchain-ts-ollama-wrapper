import { OllamaModel } from "../../interfaces/Ollama";

export default () => (new OllamaModel({
  modelName: 'llama3:8b-instruct-q5_K_M',
  ollamaInput: {
    temperature: 0.6,
  },
  assistantTemplate: `<|start_header_id|>assistant<|end_header_id|>{prompt}<|eot_id|>`,
  userTemplate: `<|start_header_id|>user<|end_header_id|>{prompt}<|eot_id|>`,
}));
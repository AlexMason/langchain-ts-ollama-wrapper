import { OllamaModel } from "../../interfaces/Ollama";

export default () => (new OllamaModel({
  modelName: 'llama3:8b-instruct-q5_K_M',
  tempature: 0.6,
  systemTemplate: `<|start_header_id|>system<|end_header_id|>{prompt}<|eot_id|>`,
  assistantTemplate: `<|start_header_id|>assistant<|end_header_id|>{prompt}<|eot_id|>`,
  userTemplate: `<|start_header_id|>user<|end_header_id|>{prompt}<|eot_id|>`,
}));
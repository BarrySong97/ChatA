import { encodingForModel } from "js-tiktoken";
const enc = encodingForModel("gpt-3.5-turbo-16k");
export function estimateTokenLength(input: string): number {
  const l = enc.encode(input);

  return l.length;
}

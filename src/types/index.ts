export type PromptStep = {
  step: number;
  prompt: string;
};

export type Prompt = {
  id: string;
  title: string;
  steps: PromptStep[];
};

export type Department = {
  id: string;
  department: string;
  price: number;
  description: string;
  prompts: Prompt[];
};

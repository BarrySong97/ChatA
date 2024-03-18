import KimiLogo from "@/assets/brand-logo/kimi.ico";
import ZhiPuLogo from "@/assets/brand-logo/zhipu.png";
export type ModelItem = {
  name: string;
  description: string;

  maxTokens: number;
  abillities: {
    file: boolean;
    image: boolean;
  };
};
export type LLMBrand = {
  name: string;
  description: string;
  icon: string;
  models: ModelItem[];
};
export const ModelList: LLMBrand[] = [
  {
    name: "智谱",
    icon: ZhiPuLogo,
    description:
      "北京智谱华章科技有限公司（简称“智谱AI”）致力于打造新一代认知智能大模型，专注于做大模型的中国创新。公司合作研发了中英双语千亿级超大规模预训练模型GLM-130B，并基于此推出对话模型ChatGLM，开源单卡版模型ChatGLM-6B。",
    models: [
      {
        name: "GLM-4",
        maxTokens: 128 * 1000,
        description:
          "新一代基座大模型GLM-4，整体性能相比GLM3全面提升60%，逼近GPT-4；支持更长上下文；更强的多模态；支持更快推理速度，更多并发，大大降低推理成本；同时GLM-4增强了智能体能力。",
        abillities: {
          file: true,
          image: false,
        },
      },
      {
        name: "GLM-3-Turbo",
        maxTokens: 8192,
        abillities: {
          file: true,
          image: false,
        },
        description:
          "适用于对知识量、推理能力、创造力要求较高的场景，比如广告文案、小说写作、知识类写作、代码生成等，支持工具调用（ Function Call、Retrieval、Web_search ）",
      },
    ],
  },
  {
    name: "KIMI - 月之暗面",
    icon: KimiLogo,
    description: "Moonshot 开放平台",
    models: [
      {
        name: "moonshot-v1-8k",
        maxTokens: 8 * 1000,
        description: "",
        abillities: {
          file: true,
          image: false,
        },
      },
      {
        name: "moonshot-v1-8k",
        maxTokens: 8 * 1000,
        description: "",
        abillities: {
          file: true,
          image: false,
        },
      },
      {
        name: "moonshot-v1-32k",
        maxTokens: 32 * 1000,
        description: "",
        abillities: {
          file: true,
          image: false,
        },
      },
      {
        name: "moonshot-v1-128k",
        maxTokens: 128 * 1000,
        description: "",
        abillities: {
          file: true,
          image: false,
        },
      },
    ],
  },
];

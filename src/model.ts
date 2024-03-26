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
  id: string;
  name: string;
  description: string;
  icon: string;
  key?: string;
  info: {
    where: {
      title: string;
      text: string;
      link: string;
    };
    api: {
      title: string;
      text: string;
      link: string;
    };
  };
  models: ModelItem[];
};
export const BrandList: LLMBrand[] = [
  {
    name: "智谱",
    icon: ZhiPuLogo,
    id: "zhipu",
    info: {
      where: {
        title: "关于智谱AI",
        text: "北京智谱华章科技有限公司（简称“智谱AI”)",
        link: "https://zhipuai.cn/",
      },
      api: {
        title: "智谱AI开放平台",
        text: "开发文档，API文档，API KEY获取",
        link: "https://open.bigmodel.cn/dev/howuse/introduction",
      },
    },
    description:
      "北京智谱华章科技有限公司（简称“智谱AI”）致力于打造新一代认知智能大模型，专注于做大模型的中国创新。公司合作研发了中英双语千亿级超大规模预训练模型GLM-130B，并基于此推出对话模型ChatGLM，开源单卡版模型ChatGLM-6B。",
    models: [
      {
        name: "GLM-4",
        maxTokens: 128 * 1000,
        description:
          "新一代基座大模型GLM-4，整体性能相比GLM3全面提升60%，逼近GPT-4；支持更长上下文；更强的多模态；支持更快推理速度，更多并发，大大降低推理成本；同时GLM-4增强了智能体能力。",
        abillities: {
          file: false,
          image: false,
        },
      },
      {
        name: "GLM-3-Turbo",
        maxTokens: 8192,
        abillities: {
          file: false,
          image: false,
        },
        description:
          "适用于对知识量、推理能力、创造力要求较高的场景，比如广告文案、小说写作、知识类写作、代码生成等，支持工具调用（ Function Call、Retrieval、Web_search ）",
      },
    ],
  },
  {
    name: "KIMI - 月之暗面",
    id: "kimi",
    icon: KimiLogo,
    description: "Moonshot 开放平台",
    info: {
      where: {
        title: "关于KIMI",
        text: "Kimi 是一个有着超大“内存”的智能助手",
        link: "https://www.moonshot.cn/",
      },
      api: {
        title: "月之暗面开放平台",
        text: "开发文档，API文档，API KEY获取",
        link: "https://platform.moonshot.cn/docs/intro#%E4%B8%BB%E8%A6%81%E6%A6%82%E5%BF%B5",
      },
    },
    models: [
      {
        name: "moonshot-v1-8k",
        maxTokens: 8 * 1000,
        description: "",
        abillities: {
          file: false,
          image: false,
        },
      },
      {
        name: "moonshot-v1-32k",
        maxTokens: 32 * 1000,
        description: "",
        abillities: {
          file: false,
          image: false,
        },
      },
      {
        name: "moonshot-v1-128k",
        maxTokens: 128 * 1000,
        description: "",
        abillities: {
          file: false,
          image: false,
        },
      },
    ],
  },
];

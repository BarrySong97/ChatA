import { atom } from "jotai";
import { LLMBrand, ModelItem } from "./model";

export const brandAtom = atom<LLMBrand | undefined>(undefined);
export const currentModelAtom = atom<ModelItem | undefined>(undefined);

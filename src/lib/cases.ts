import casesJson from "@/content/cases.json";
import type { CaseItem, CaseKind } from "./content";

export const caseKinds = casesJson.kinds as Record<CaseKind, string>;
export const cases = casesJson.cases as CaseItem[];
/** Kinds that actually have cases, in display order. */
export const usedKinds = (Object.keys(caseKinds) as CaseKind[]).filter((k) => cases.some((c) => c.kind === k));

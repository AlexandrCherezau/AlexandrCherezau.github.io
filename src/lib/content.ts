import siteJson from "@/content/site.json";
import servicesJson from "@/content/services.json";
import casesJson from "@/content/cases.json";
import reviewsJson from "@/content/reviews.json";
import processJson from "@/content/process.json";
import faqJson from "@/content/faq.json";
import kworksJson from "@/content/kworks.json";

export type CaseKind = "bot" | "landing" | "site" | "app" | "parser" | "ai";

export interface CaseImage {
  src: string;
  w: number;
  h: number;
  alt: string;
}

export interface CaseItem {
  id: string;
  title: string;
  kind: CaseKind;
  status: string;
  task: string;
  solution: string;
  stack: string[];
  result: string;
  links: { label: string; url: string }[];
  images: CaseImage[];
  cover: string;
}

export interface Service {
  id: string;
  title: string;
  includes: string[];
  days: number;
  price: number;
  priceNote?: string;
  kwork: string;
  kworkTitle: string;
  tgUrl: string;
}

export interface Review {
  author: string;
  service: string;
  dateLabel: string;
  date: string;
  text: string;
  featured: boolean;
}

export const site = siteJson;
export const services: Service[] = servicesJson.services;
export const servicesNote = servicesJson.note;
export const caseKinds = casesJson.kinds as Record<CaseKind, string>;
export const cases = casesJson.cases as CaseItem[];
export const reviews: Review[] = reviewsJson.reviews;
export const reviewStats = reviewsJson.stats;
export const reviewsSource = reviewsJson.source;
export const steps = processJson.steps;
export const faq = faqJson.items;
export const popularKworks = kworksJson.popular;
export const kworksTotal = kworksJson.total;

/** Prefix for files in /public when the site is deployed under a sub-path. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE_PATH}${path}`;

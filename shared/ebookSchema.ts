import { z } from "zod";

export const generateContentSchema = z.object({
  theme: z.string().min(3, "Tema deve ter no mínimo 3 caracteres"),
  targetAudience: z.string().min(3, "Público-alvo deve ter no mínimo 3 caracteres"),
  objective: z.string().min(10, "Objetivo deve ter no mínimo 10 caracteres"),
  mainPain: z.string().min(10, "Descreva a dor principal").optional(),
  realisticPromise: z.string().min(10, "Descreva a promessa").optional(),
});

export const generatePDFSchema = z.object({
  projectId: z.string().optional(),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  structuredData: z.any().optional(),
  template: z.enum(["educational", "marketing", "storytelling"]).default("educational"),
  assetType: z.enum(["ebook", "cover", "audiobook"]).default("ebook"),
});

export const saveProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  theme: z.string().optional(),
  targetAudience: z.string().optional(),
  objective: z.string().optional(),
  assetType: z.enum(["ebook", "cover", "audiobook"]).optional(),
  status: z.enum(["draft", "generating", "completed", "error"]).optional(),
});

export const getProjectsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["draft", "generating", "completed", "error"]).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const deleteProjectSchema = z.object({
  id: z.string().min(1, "ID do projeto é obrigatório"),
});

export type GenerateContentInput = z.infer<typeof generateContentSchema>;
export type GeneratePDFInput = z.infer<typeof generatePDFSchema>;
export type SaveProjectInput = z.infer<typeof saveProjectSchema>;
export type GetProjectsInput = z.infer<typeof getProjectsSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;

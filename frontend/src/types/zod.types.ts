import { z } from "zod";

// --- LOGIN SCHEMA ---
export const loginSchema = z.object({
  login: z.string()
    .trim()
    .min(1, 'Por favor, informe seu usuário'),
  password: z.string()
    .min(1, 'Por favor, informe sua senha'),
});

// --- REGISTER SCHEMA ---
export const registerSchema = z.object({
  login: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'O usuário deve ter pelo menos 3 caracteres')
    .max(20, 'O usuário deve ter no máximo 20 caracteres')
    .regex(/^[a-z0-9._-]+$/, 'Use apenas letras sem acento, números, ponto (.), traço (-) ou underline (_)')
    .regex(/^(?!\d+$).+$/, 'O usuário não pode conter apenas números'),

  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),

  confirmPassword: z
    .string()
    .min(1, 'Por favor, confirme sua senha'),
  userRole: z.enum(["USER", "ADMIN"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// --- ARTIST SCHEMA ---
export const artistSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  year: z.number().optional().nullable(),
  image: z.any().optional(),
  albumIds: z.array(z.number()).optional()
});

// --- ALBUM SCHEMA ---
export const albumSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Título do álbum é obrigatório')
    .min(2, 'Título deve ter pelo menos 2 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  artistId: z.preprocess(
    (val) => Number(val), 
    z.number().min(1, 'Selecione um artista')
  ),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ArtistInput = z.infer<typeof artistSchema>;
export type AlbumInput = z.infer<typeof albumSchema>;
# Chácara da Nega

App de reservas para espaço de lazer/eventos. PWA construído com Next.js + TypeScript + Supabase + Vercel.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, Storage, RLS)
- Deploy: Vercel (conectado ao GitHub)

## Configuração local
1. Crie um projeto em https://supabase.com
2. Copie `.env.example` para `.env.local` e preencha com as chaves do projeto Supabase (Settings → API)
3. `npm install`
4. `npm run dev`

## Deploy
Conecte este repositório na Vercel e configure as mesmas variáveis de ambiente do `.env.example` em Project Settings → Environment Variables.

## Status
- [x] Etapa 1 — Fundação
- [ ] Etapa 2 — Banco e autenticação
- [ ] Etapa 3 — Área pública
- [ ] Etapa 4 — Sistema de reservas
- [ ] Etapa 5 — WhatsApp
- [ ] Etapa 6 — Painel administrativo
- [ ] Etapa 7 — PWA
- [ ] Etapa 8 — Revisão# chacara-da-nega

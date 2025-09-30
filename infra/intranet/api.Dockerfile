# Etapa base com PNPM
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# Copia monorepo inteiro (ajuste se quiser)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

# Instala dependências do monorepo
RUN pnpm install --frozen-lockfile

# Build da lib compartilhada (se houver)
RUN pnpm -F @manutencao/shared build || echo "sem shared ou já buildado"

# Build da API (se usa TS)
RUN pnpm -F @manutencao/api build || echo "api já pronta"

# ---- runtime
FROM node:20-alpine
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production

# Copia node_modules e código da api já buildados
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api ./apps/api
COPY --from=base /app/packages ./packages
COPY --from=base /app/pnpm-workspace.yaml ./
COPY --from=base /app/package.json ./

EXPOSE 3000
CMD ["pnpm", "-F", "@manutencao/api", "start"]

# apps/api/Dockerfile
FROM node:22-alpine
RUN corepack enable

WORKDIR /app

# Copia manifests do monorepo e só a API
COPY package.json pnpm-lock.yaml ./
COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN pnpm i --prod=false
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","dist/index.js"]

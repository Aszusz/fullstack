FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json

RUN npm ci

FROM deps AS build
WORKDIR /app

COPY tsconfig.json tsconfig.json
COPY apps/web/ apps/web/

RUN npm run build -w web

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=5173
ENV PORT=5173

COPY --from=build /app/apps/web/.output /app/.output

EXPOSE 5173
CMD ["node", ".output/server/index.mjs"]

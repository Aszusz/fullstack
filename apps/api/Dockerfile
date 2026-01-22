FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/db/package.json packages/db/package.json

RUN npm ci

FROM deps AS build
WORKDIR /app

COPY tsconfig.json tsconfig.json
COPY apps/api/ apps/api/
COPY packages/db/ packages/db/

RUN npm run build -w @fullstack/db
RUN npm run build -w @fullstack/api
RUN npm prune --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/apps/api/dist /app/apps/api/dist
COPY --from=build /app/apps/api/package.json /app/apps/api/package.json
COPY --from=build /app/packages/db/dist /app/packages/db/dist
COPY --from=build /app/packages/db/package.json /app/packages/db/package.json

EXPOSE 3000
CMD ["node", "apps/api/dist/index.js"]

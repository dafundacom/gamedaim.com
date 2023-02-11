FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN npm install --global pnpm turbo
COPY . .
RUN pnpm turbo prune --scope=gamedaim-server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install --global pnpm turbo

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo run build --filter=gamedaim-server...

FROM node:18-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 fastify
RUN adduser --system --uid 1001 fastify
USER fastify

COPY --from=installer /app .
COPY --from=installer --chown=fastify:fastify /app ./

RUN cd packages/server && npx prisma generate
CMD node packages/server/dist/src/app.js

# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---- Development: Vite dev server with hot reload ----
FROM base AS dev
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--mode", "docker"]

# ---- Build: compiles the static production bundle ----
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# ---- Production preview: serves the built bundle via nginx ----
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html/bingo-shiny-hunt
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

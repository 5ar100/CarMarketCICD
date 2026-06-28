# ── Stage 1: Build ──────────────────────────────────────────────────────────
# Use Node 18 (LTS) to install dependencies and compile React into static files.
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package files first so Docker caches the npm install layer.
# If only source code changes, this layer is reused and npm install is skipped.
COPY package.json package-lock.json ./
RUN npm ci --silent

# REACT_APP_API_URL is injected at build time so the compiled JS knows
# where the backend is. Defaults to localhost:8000 for local development.
ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY . .
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
# Discard the Node image entirely. Only copy the compiled static files into
# a tiny nginx image (~25 MB vs ~1 GB for the Node image).
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

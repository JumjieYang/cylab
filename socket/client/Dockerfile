FROM bitnami/node:latest AS BUILDER

WORKDIR /app
COPY . /app
RUN npm i
RUN npm run build

FROM nginx:mainline-alpine-slim AS RUNNER

COPY --from=BUILDER /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
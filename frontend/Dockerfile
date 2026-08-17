# Stage 1: build
FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend .
COPY frontend/.env .env

ARG REACT_APP_MODE
ENV REACT_APP_MODE=${REACT_APP_MODE}

ARG REACT_APP_GA_MEASUREMENT_ID
ENV REACT_APP_GA_MEASUREMENT_ID=${REACT_APP_GA_MEASUREMENT_ID}

RUN npm run build


# Stage 2: serve
FROM nginx:1.27-alpine AS runner

RUN rm /etc/nginx/conf.d/default.conf

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

STOPSIGNAL SIGQUIT

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

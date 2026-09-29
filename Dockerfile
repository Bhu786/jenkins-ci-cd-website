FROM nginx:alpine

LABEL maintainer="DevOps CI/CD Project"

RUN rm -rf /usr/share/nginx/html/*

COPY index.html /usr/share/nginx/html/

COPY css /usr/share/nginx/html/css

COPY js /usr/share/nginx/html/js

COPY images /usr/share/nginx/html/images

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
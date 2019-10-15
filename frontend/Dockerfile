from nginx:alpine

COPY nginx.conf /etc/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist/frontend/ .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

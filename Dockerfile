FROM nginx

COPY ./build /usr/share/nginx/html
COPY nginx.conf /etc/nginx

EXPOSE 3000

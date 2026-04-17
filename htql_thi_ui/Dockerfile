FROM node:20-alpine AS build
WORKDIR /app
# Chỉ copy file package trước để tận dụng cache
COPY package*.json ./
# Cài đặt nhanh hơn, bỏ qua các dữ liệu thừa
RUN npm install --frozen-lockfile --loglevel=error
COPY . .
# Thực hiện build
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
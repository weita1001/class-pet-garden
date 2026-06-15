FROM node:22-slim
WORKDIR /app
COPY . .
RUN npm install serve@14.2.0
EXPOSE 3000
CMD ["npx", "serve", ".", "-l", "3000", "-s"]

FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci
COPY tsconfig.json jest.config.js ./
COPY src ./src
COPY ../prisma ./prisma
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run", "dev"]
